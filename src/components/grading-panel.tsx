
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import { Star, Download, FileText, Edit, Save, X } from 'lucide-react';

interface GradingPanelProps {
  submission: any;
  assignment: any;
  onGradeSubmit: (submissionId: number, grade: number, feedback: string) => void;
}

export const GradingPanel: React.FC<GradingPanelProps> = ({
  submission,
  assignment,
  onGradeSubmit
}) => {
  const [grade, setGrade] = useState(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isEditing, setIsEditing] = useState(submission.status !== 'graded');

  const handleSubmit = () => {
    const numGrade = parseInt(grade);
    if (numGrade >= 0 && numGrade <= assignment.points) {
      onGradeSubmit(submission.id, numGrade, feedback);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
  };

  const downloadFile = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/api/files/download/${fileName}`;
    link.download = fileName;
    link.click();
  };

  const getGradeColor = (grade: number, maxPoints: number) => {
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{submission.studentName}</CardTitle>
            <p className="text-sm text-gray-500">
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <Badge className={submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
            {submission.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Submission Text */}
        <div>
          <h4 className="font-medium mb-2">Submission Text:</h4>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-gray-700">{submission.submissionText}</p>
          </div>
        </div>

        {/* Attached File */}
        {submission.fileName && (
          <div>
            <h4 className="font-medium mb-2">Attached File:</h4>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="flex-1 text-sm">{submission.fileName}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadFile(submission.fileName)}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}

        {/* Grading Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Grading</h4>
            {submission.status === 'graded' && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Grade
              </Button>
            )}
          </div>
          
          {submission.status === 'graded' && !isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className={`text-lg font-bold ${getGradeColor(submission.grade, assignment.points)}`}>
                  {submission.grade}/{assignment.points} points
                </span>
                <span className="text-sm text-gray-500">
                  ({Math.round((submission.grade / assignment.points) * 100)}%)
                </span>
              </div>
              
              {submission.feedback && (
                <div>
                  <h5 className="font-medium text-sm mb-1">Feedback:</h5>
                  <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Grade (out of {assignment.points})
                </label>
                <Input
                  type="number"
                  min="0"
                  max={assignment.points}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Enter grade"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Feedback (Optional)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!grade || parseInt(grade) < 0 || parseInt(grade) > assignment.points}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                </Button>
                
                {submission.status === 'graded' && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
