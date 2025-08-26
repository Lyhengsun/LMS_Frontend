
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MessageCircle, BookOpen } from 'lucide-react';
import { LessonOverview } from '@/src/components/LessonOverview';
import { VideoComments } from '@/src/components/VideoComments';
import { LessonResources } from '@/src/components/LessonResources';

interface LessonTabsProps {
  courseId: number;
  lessonId: number;
  lessonTitle: string;
  lessonDescription?: string;
  duration: string;
  resources?: any[];
}

export const LessonTabs = ({ 
  courseId, 
  lessonId, 
  lessonTitle, 
  lessonDescription,
  duration,
  resources = []
}: LessonTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-t-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="discussion" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discussion</span>
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-6">
          <LessonOverview
            title={lessonTitle}
            description={lessonDescription}
            duration={duration}
          />
        </TabsContent>

        <TabsContent value="discussion" className="p-6">
          <VideoComments courseId={courseId} lessonId={lessonId} />
        </TabsContent>

        <TabsContent value="resources" className="p-6">
          <LessonResources courseId={courseId} lessonId={lessonId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
