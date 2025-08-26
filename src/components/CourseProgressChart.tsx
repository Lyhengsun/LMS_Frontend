
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ProgressData {
  date: string;
  completed: number;
  inProgress: number;
}

interface CourseProgressChartProps {
  data: ProgressData[];
  totalCourses: number;
}

export const CourseProgressChart = ({ data, totalCourses }: CourseProgressChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-green-600">
            Completed: {payload[0]?.value}%
          </p>
          <p className="text-sm text-blue-600">
            In Progress: {payload[1]?.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (totalCourses === 0) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Course Progress Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No courses enrolled yet</p>
            <p className="text-sm">Start your learning journey today!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Course Progress Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="completed" 
                fill="#10b981" 
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="inProgress" 
                fill="#3b82f6" 
                name="In Progress"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {data.length > 0 ? data[data.length - 1]?.completed || 0 : 0}%
              </p>
              <p className="text-sm text-gray-600">Latest Progress</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
