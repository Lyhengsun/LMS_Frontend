"use client"
import { useState } from 'react';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'document' | 'link';
  url: string;
  size?: string;
  description?: string;
  downloadable: boolean;
}

interface LessonResourcesProps {
  courseId: number;
  lessonId: number;
}

export const LessonResources = ({ courseId, lessonId }: LessonResourcesProps) => {
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  // Mock resources data - in real app this would come from API
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Course Introduction Slides',
      type: 'pdf',
      url: '/mock-resources/introduction-slides.pdf',
      size: '2.5 MB',
      description: 'Comprehensive slides covering the introduction to this course.',
      downloadable: true
    },
    {
      id: 2,
      title: 'Code Examples',
      type: 'pdf',
      url: '/mock-resources/code-examples.pdf',
      size: '1.8 MB',
      description: 'All code examples and snippets used in this lesson.',
      downloadable: true
    },
    {
      id: 3,
      title: 'Additional Reading Material',
      type: 'pdf',
      url: '/mock-resources/reading-material.pdf',
      size: '3.2 MB',
      description: 'Supplementary reading materials and references.',
      downloadable: true
    },
    {
      id: 4,
      title: 'Official Documentation',
      type: 'link',
      url: 'https://example.com/docs',
      description: 'Link to official documentation for further learning.',
      downloadable: false
    }
  ];

  const handleDownload = (resource: Resource) => {
    // In a real app, this would handle the actual download
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (resource: Resource) => {
    if (resource.type === 'pdf') {
      setViewingResource(resource);
    } else if (resource.type === 'link') {
      window.open(resource.url, '_blank');
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'document':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'link':
        return <ExternalLink className="w-6 h-6 text-green-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'document':
        return 'bg-blue-100 text-blue-800';
      case 'link':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Lesson Resources</h3>
        <Badge variant="secondary">{resources.length} files</Badge>
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources available for this lesson.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getResourceTypeColor(resource.type)}>
                            {resource.type.toUpperCase()}
                          </Badge>
                          {resource.size && (
                            <span className="text-xs text-gray-500">{resource.size}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(resource)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                        {resource.downloadable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(resource)}
                            className="flex items-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingResource} onOpenChange={() => setViewingResource(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{viewingResource?.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-gray-100 rounded-lg">
            {viewingResource?.type === 'pdf' ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">PDF Viewer</p>
                    <p className="text-gray-600">PDF viewing would be implemented here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      In a real application, you would integrate a PDF viewer like PDF.js
                    </p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => handleDownload(viewingResource)}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setViewingResource(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={viewingResource?.url}
                className="w-full h-full border-0"
                title={viewingResource?.title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};