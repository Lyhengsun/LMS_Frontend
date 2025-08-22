"use client"
import { FileUpload } from '@/components/file-upload';
import { GradingPanel } from '@/components/grading-panel';
import { Sidebar } from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/lib/hooks/use-toast';
import { useAssignmentStore } from '@/lib/hooks/useAssignmentStore';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { getUserRole } from '@/lib/utils';
import { CalendarDays, CheckCircle, Clock, Download, Eye, FileText, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const InstructorAssignmentPageComponent = () => {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, getAssignmentSubmissions, gradeSubmission } = useAssignmentStore();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    estimatedTime: '',
    course: 'React Development'
  });

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate || !newAssignment.points) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate file upload - in real app, this would upload to server
    const attachedFileName = attachedFile ? `assignment_${Date.now()}_${attachedFile.name}` : undefined;

    const assignment = addAssignment({
      title: newAssignment.title,
      description: newAssignment.description,
      course: newAssignment.course,
      dueDate: newAssignment.dueDate,
      status: 'active',
      points: parseInt(newAssignment.points) || 0,
      estimatedTime: newAssignment.estimatedTime,
      attachedFile: attachedFileName,
      createdBy: 'Instructor'
    });

    setNewAssignment({ 
      title: '', 
      description: '', 
      dueDate: '', 
      points: '', 
      estimatedTime: '',
      course: 'React Development'
    });
    setAttachedFile(null);
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Assignment created successfully!",
    });
  };

  const handleGradeSubmission = (submissionId: number, grade: number, feedback: string) => {
    // Get the submission to find student info
    const submission = assignments
      .flatMap(a => getAssignmentSubmissions(a.id))
      .find(s => s.id === submissionId);
    
    const assignment = assignments.find(a => 
      getAssignmentSubmissions(a.id).some(s => s.id === submissionId)
    );

    gradeSubmission(submissionId, grade, feedback);
    
    // Notify student about their grade with detailed information
    if (submission && assignment) {
      const percentage = Math.round((grade / assignment.points) * 100);
      addNotification({
        title: '🎯 Assignment Graded!',
        message: `Your "${assignment.title}" has been graded. Score: ${grade}/${assignment.points} points (${percentage}%)${feedback ? '. Check your feedback!' : ''}`,
        priority: 'high'
      });
    }
    
    toast({
      title: "Success",
      description: `Grade ${submission?.grade !== undefined ? 'updated' : 'submitted'} successfully!`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadAssignmentFile = (fileName: string) => {
    // In a real app, this would be an API call
    const link = document.createElement('a');
    link.href = `/api/files/download/${fileName}`;
    link.download = fileName;
    link.click();
  };

  // Instructor and Admin view
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Assignments</h1>
              <p className="text-sm text-gray-500">Create and manage assignments for your students</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create New Assignment</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      placeholder="Assignment title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <Textarea
                      placeholder="Assignment description and instructions"
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment (PDF, DOC, ZIP files)
                    </label>
                    <FileUpload
                      onFileSelect={setAttachedFile}
                      currentFile={attachedFile?.name}
                      onRemove={() => setAttachedFile(null)}
                      acceptedTypes=".pdf,.doc,.docx,.zip,.txt"
                      maxSize={25}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                      <Input
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Points *</label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newAssignment.points}
                        onChange={(e) => setNewAssignment({...newAssignment, points: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time</label>
                    <Input
                      placeholder="e.g., 2-3 hours"
                      value={newAssignment.estimatedTime}
                      onChange={(e) => setNewAssignment({...newAssignment, estimatedTime: e.target.value})}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateAssignment} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Create Assignment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {assignments.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {assignments.reduce((acc, a) => acc + getAssignmentSubmissions(a.id).length, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Grading</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {assignments.reduce((acc, a) => 
                        acc + getAssignmentSubmissions(a.id).filter(s => s.status === 'submitted').length, 0
                      )}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                  <p className="text-gray-500">Create your first assignment to get started.</p>
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => {
                const submissions = getAssignmentSubmissions(assignment.id);
                const pendingGrading = submissions.filter(s => s.status === 'submitted').length;

                return (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                          <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                          <p className="text-sm text-gray-700 mb-2">{assignment.description}</p>
                          
                          {assignment.attachedFile && (
                            <div className="flex items-center space-x-2 mt-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-600">{assignment.attachedFile}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => downloadAssignmentFile(assignment.attachedFile!)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                          {pendingGrading > 0 && (
                            <Badge className="bg-red-100 text-red-800">
                              {pendingGrading} to grade
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Points: {assignment.points}
                          </div>
                          <div className="text-sm text-gray-600">
                            Submissions: {submissions.length}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAssignment(assignment.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Submissions ({submissions.length})
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Submissions Modal */}
          {selectedAssignment && (
            <SubmissionsModal
              assignmentId={selectedAssignment}
              assignment={assignments.find(a => a.id === selectedAssignment)!}
              submissions={getAssignmentSubmissions(selectedAssignment)}
              onClose={() => setSelectedAssignment(null)}
              onGrade={handleGradeSubmission}
            />
          )}
        </main>
      </div>
    </div>
  );
};

const SubmissionsModal = ({ 
  assignmentId, 
  assignment, 
  submissions, 
  onClose, 
  onGrade 
}: {
  assignmentId: number;
  assignment: any;
  submissions: any[];
  onClose: () => void;
  onGrade: (submissionId: number, grade: number, feedback: string) => void;
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submissions for "{assignment.title}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No submissions yet</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <GradingPanel
                key={submission.id}
                submission={submission}
                assignment={assignment}
                onGradeSubmit={onGrade}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InstructorAssignmentPageComponent