import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Badge,
  HelpCircle,
  Clock,
  Users,
  BarChart,
  Edit,
  Trash2,
} from "lucide-react";
import React from "react";

// const QuizCardComponent = () => {
//   return (
//     <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
//             <p className="text-sm text-gray-600">Course: {quiz.course}</p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-6 text-sm text-gray-600">
//             <div className="flex items-center space-x-1">
//               <HelpCircle className="w-4 h-4" />
//               <span>{quiz.questions} questions</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Clock className="w-4 h-4" />
//               <span>{quiz.duration}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Users className="w-4 h-4" />
//               <span>
//                 {quiz.attempts}/{quiz.totalStudents} attempts
//               </span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <BarChart className="w-4 h-4" />
//               <span>{quiz.averageScore}% avg</span>
//             </div>
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm">
//               <Edit className="w-4 h-4 mr-1" />
//               Edit
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className="text-red-600 hover:text-red-800"
//             >
//               <Trash2 className="w-4 h-4 mr-1" />
//               Delete
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default QuizCardComponent;
