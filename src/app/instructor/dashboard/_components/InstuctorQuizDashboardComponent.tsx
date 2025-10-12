import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, BarChart3, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

const quizzes = [
  {
    id: 1,
    title: "React Hooks Quiz",
    course: "React Development",
    attempts: 234,
    avgScore: 85,
    questions: 15,
    duration: 30, // minutes
  },
  {
    id: 2,
    title: "JavaScript ES6 Assessment",
    course: "JavaScript Fundamentals",
    attempts: 412,
    avgScore: 78,
    questions: 20,
    duration: 45,
  },
  {
    id: 3,
    title: "Async Programming Test",
    course: "Node.js Backend",
    attempts: 0,
    avgScore: null,
    questions: 12,
    duration: 25,
  },
  {
    id: 4,
    title: "TypeScript Generics Quiz",
    course: "TypeScript Advanced",
    attempts: 0,
    avgScore: null,
    questions: 18,
    duration: 40,
  },
  {
    id: 5,
    title: "CSS Flexbox Challenge",
    course: "Web Design Principles",
    attempts: 189,
    avgScore: 92,
    questions: 10,
    duration: 20,
  },
]

export function InstuctorQuizDashboardComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Quiz Management Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-lg border border-border p-5 hover:bg-accent/50 transition-all hover:shadow-sm"
            >
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{quiz.course}</p>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{quiz.attempts}</span> attempts
                    </span>
                  </div>
                  
                  {quiz.avgScore !== null && (
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Avg Score: <span className="font-medium text-foreground">{quiz.avgScore}%</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-normal">
                      {quiz.questions} Questions
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {quiz.duration} min
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
                {quiz.attempts > 0 && (
                  <Link href={`/instructor/dashboard/quizzes/${quiz.id}`}>
                    <Button variant="default" size="sm" className="gap-1.5">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
