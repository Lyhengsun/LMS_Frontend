import { Card, CardContent } from "@/components/ui/card";
import { InstructorStatsData } from "@/src/type/Dashboard";
import { BookOpen, HelpCircle, Users, Activity } from "lucide-react";

// Static UI configuration
const STATS_CONFIG = [
  {
    key: "myCourses" as const,
    title: "My Courses",
    getDescription: (stats: InstructorStatsData) =>
      `${stats.coursesPublished} Published, ${stats.coursesDraft} Draft, ${stats.coursesPending} Pending`,
    icon: BookOpen,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "quizzesCreated" as const,
    title: "Quizzes Created",
    getDescription: (stats: InstructorStatsData) =>
      `${stats.quizTotalAttempts} Total attempts`,
    icon: HelpCircle,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    key: "activeStudentsThisWeek" as const,
    title: "Active Students",
    getDescription: (stats: InstructorStatsData) => `Active this week`,
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    key: "quizzesAttemptedToday" as const,
    title: "Recent Activity",
    getDescription: () => "Quizzes attempted today",
    icon: Activity,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

export function InstructorStatsCardComponent({
  instructorSummaryStat,
}: {
  instructorSummaryStat: InstructorStatsData;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {STATS_CONFIG.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {instructorSummaryStat[stat.key]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.getDescription(instructorSummaryStat)}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
