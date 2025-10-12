"use client";

import {
  Trophy,
  TrendingUp,
  Award,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentLearningInsight } from "@/src/type/Dashboard";

// const learningInsights = {
//   lessonsThisWeek: 8,
//   quizImprovement: 12,
//   streakDays: 5,
// };

const LearningInsightComponent = ({
  learningInsights,
}: {
  learningInsights: StudentLearningInsight;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-2xl font-bold">
                {learningInsights.lessonsThisWeek}
              </p>
              <p className="text-sm text-muted-foreground">
                Lessons completed this week
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            {learningInsights.quizImprovement < 0 ? (
              <TrendingDown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            )}
            <div>
              <p className="text-2xl font-bold">
                {learningInsights.quizImprovement < 0 ? "" : "+"}
                {learningInsights.quizImprovement}%
              </p>
              <p className="text-sm text-muted-foreground">
                Quiz score improvement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-2xl font-bold">
                {learningInsights.streakDays}{" "}
                {learningInsights.streakDays > 1 ? "days" : "day"}
              </p>
              <p className="text-sm text-muted-foreground">
                Current learning streak
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningInsightComponent;
