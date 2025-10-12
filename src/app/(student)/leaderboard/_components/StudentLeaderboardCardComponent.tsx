"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Leaderboard } from "@/src/type/Leaderboard";
import { Trophy, Medal, Star, UserIcon} from "lucide-react";
import React from "react";

const StudentLeaderboardCardComponent = ({
  rankNumber,
  student,
  isCurrentUser,
}: {
  rankNumber: number;
  student: Leaderboard;
  isCurrentUser: boolean;
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    return <Star className="w-5 h-5 text-blue-500" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3)
      return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
  };

  return (
    <div
      className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-200 ${
        isCurrentUser
          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadge(
            rankNumber
          )}`}
        >
          <span className="font-bold text-white">#{rankNumber}</span>
        </div>
        {getRankIcon(rankNumber)}
      </div>

      <Avatar className="w-12 h-12 ring-2 ring-blue-100">
				<AvatarImage src={`${process.env.BASE_API_URL}/files/preview-file/${student.student.avatarUrl}`} alt="User Profile" />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
					<UserIcon className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold text-gray-900">
            {student.student.fullName}
          </h3>
          {isCurrentUser && (
            <Badge className="bg-blue-100 text-blue-800 text-xs">You</Badge>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Course: {student.coursePoints} pts</span>
          <span>Quiz: {student.quizPoints} pts</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">
          {student.totalPoints}
        </div>
        <div className="text-sm text-gray-500">Total Points</div>
      </div>
    </div>
  );
  //   return (
  //                 <div
  //                   className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-200 ${
  //                     student.isCurrentUser
  //                       ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md"
  //                       : "bg-gray-50 hover:bg-gray-100"
  //                   }`}
  //                 >
  //                   <div className="flex items-center space-x-3">
  //                     <div
  //                       className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadge(
  //                         student.rank
  //                       )}`}
  //                     >
  //                       <span className="font-bold text-white">
  //                         #{student.rank}
  //                       </span>
  //                     </div>
  //                     {getRankIcon(student.rank)}
  //                   </div>

  //                   <Avatar className="w-12 h-12 ring-2 ring-blue-100">
  //                     <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
  //                       {student.avatar}
  //                     </AvatarFallback>
  //                   </Avatar>

  //                   <div className="flex-1">
  //                     <div className="flex items-center space-x-2 mb-1">
  //                       <h3 className="font-semibold text-gray-900">
  //                         {student.name}
  //                       </h3>
  //                       {student.isCurrentUser && (
  //                         <Badge className="bg-blue-100 text-blue-800 text-xs">
  //                           You
  //                         </Badge>
  //                       )}
  //                     </div>
  //                     <div className="flex items-center space-x-4 text-sm text-gray-600">
  //                       <span>Course: {student.points} pts</span>
  //                       <span>Assignment: {student.assignmentPoints} pts</span>
  //                     </div>
  //                   </div>

  //                   <div className="text-right">
  //                     <div className="text-2xl font-bold text-gray-900">
  //                       {student.points + (student.assignmentPoints || 0)}
  //                     </div>
  //                     <div className="text-sm text-gray-500">Total Points</div>
  //                   </div>
  //                 </div>
  //   )
};

export default StudentLeaderboardCardComponent;
