"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Search,
  Clock,
  Users,
  HelpCircle,
  Award,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quiz, QuizResult } from "@/src/type/Quiz";
import Category from "@/src/type/Category";
import useDebounce from "@/src/lib/hooks/useDebounce";
import {
  getQuizzesForStudentAction,
  studentGetQuizResultByQuizIdAction,
  studentTakeQuizAction,
} from "@/src/action/quizAction";
import { getCategoryAction } from "@/src/action/categoryAction";
import { toast } from "sonner";
import StudentQuizCardComponent from "./StudentQuizCardComponent";
import { useRouter } from "next/navigation";

export default function StudentQuizPageComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchQueryDebounce = useDebounce(searchQuery, 300);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | undefined>("all");
  const [filterLevel, setFilterLevel] = useState<string | undefined>("all");
  const [sortBy, setSortBy] = useState<"QUIZ_NAME" | "CREATED_AT">("CREATED_AT");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref, inView } = useInView();
  const router = useRouter();
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(0);
  const [allAttempts, setAllAttempts] = useState<QuizResult[]>([]);

  const loadQuizzes = async () => {
    const categoryId = filterCategory === "all" ? undefined : filterCategory;
    const level = filterLevel === "all" ? undefined : filterLevel;
    const data = await getQuizzesForStudentAction(
      page,
      10,
      searchQueryDebounce,
      categoryId as any,
      level as any,
      sortBy,
      sortOrder
    );
    if (data.success) {
      const pagination = data.data?.pagination;
      setHasNextPage(pagination!.currentPage < pagination!.totalPages);
      return data.data?.items!;
    } else {
      toast.error("Failed to fetch quizzes");
      setHasNextPage(false);
    }
  };

  const updateQuizzes = async () => {
    console.log("update quiz");
    if (page == 1) {
      const newLoadedQuiz = await loadQuizzes();
      setQuizzes(newLoadedQuiz!);
    }
    if (oldPage < page) {
      const newLoadedQuiz = await loadQuizzes();
      setQuizzes((prevQuizzes) => [...prevQuizzes, ...newLoadedQuiz!]);
    }
    setOldPage(page);
  };

  useEffect(() => {
    console.log("load quiz");
    updateQuizzes();
  }, [page]);

  useEffect(() => {
    if (inView && hasNextPage) {
      setPage(page + 1);
    }
  }, [inView]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getCategoryAction();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // update quiz list when searching
  useEffect(() => {
    setPage(1);
    const reloadQuiz = async () => {
      const quizzes = await loadQuizzes();
      if (quizzes) {
        setQuizzes(quizzes);
      }
    };

    if (oldPage == page) {
      reloadQuiz();
    }
  }, [searchQueryDebounce]);

  // Update quiz list when category filter changes
  useEffect(() => {
    setPage(1);
    const reloadQuiz = async () => {
      const quizzes = await loadQuizzes();
      if (quizzes) {
        setQuizzes(quizzes);
      }
    };

    if (oldPage === page) {
      reloadQuiz();
    }
  }, [filterCategory]);

  // Update quiz list when level filter changes
  useEffect(() => {
    setPage(1);
    const reloadQuiz = async () => {
      const quizzes = await loadQuizzes();
      if (quizzes) {
        setQuizzes(quizzes);
      }
    };

    if (oldPage === page) {
      reloadQuiz();
    }
  }, [filterLevel]);

  // Update quiz list when sorting changes
  useEffect(() => {
    setPage(1);
    const reloadQuiz = async () => {
      const quizzes = await loadQuizzes();
      if (quizzes) {
        setQuizzes(quizzes);
      }
    };

    if (oldPage === page) {
      reloadQuiz();
    }
  }, [sortBy, sortOrder]);

  async function handleOnTakeQuiz(id: number): Promise<void> {
    const takeQuizResponse = await studentTakeQuizAction(id);

    if (takeQuizResponse.success) {
      setQuizzes([]);
      toast.success("Quiz started");
      router.push(`/quiz/${takeQuizResponse.data?.id}`);
    }
  }

  async function handleOnViewResult(quizId: number): Promise<void> {
    const quizResultResponse = await studentGetQuizResultByQuizIdAction(quizId);

    if (quizResultResponse.success && quizResultResponse.data) {
      setAllAttempts(quizResultResponse.data);
      setCurrentAttemptIndex(0);
      setSelectedResult(quizResultResponse.data[0]);
    } else {
      toast.error("Failed to load user result");
    }
  }

  const handlePreviousAttempt = () => {
    if (currentAttemptIndex > 0) {
      const newIndex = currentAttemptIndex - 1;
      setCurrentAttemptIndex(newIndex);
      setSelectedResult(allAttempts[newIndex]);
    }
  };

  const handleNextAttempt = () => {
    if (currentAttemptIndex < allAttempts.length - 1) {
      const newIndex = currentAttemptIndex + 1;
      setCurrentAttemptIndex(newIndex);
      setSelectedResult(allAttempts[newIndex]);
    }
  };

  return (
    <div className="flex-1">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Available Quizzes
          </h1>
          <p className="text-muted-foreground">
            Browse and take quizzes to test your knowledge
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="all">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCE">Advanced</option>
            </select>

            <ArrowUpDown className="w-4 h-4 text-muted-foreground ml-2" />

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "QUIZ_NAME" | "CREATED_AT")}
              className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="CREATED_AT">Date Created</option>
              <option value="QUIZ_NAME">Quiz Name</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
              className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 grid grid-cols-2 gap-x-4">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id}>
              {index == quizzes.length - 1 && hasNextPage && (
                <div ref={ref}></div>
              )}
              <StudentQuizCardComponent
                quiz={quiz}
                handleOnViewResult={handleOnViewResult}
                handleOnTakeQuiz={handleOnTakeQuiz}
              />
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery != null || searchQuery != ""
                ? "There are no quiz to show"
                : "No quizzes found matching your search."}
            </p>
          </div>
        )}
      </div>
      {/* Results Modal */}
      {/* Results Modal */}
      <Dialog
        open={!!selectedResult}
        onOpenChange={() => setSelectedResult(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Quiz Results</DialogTitle>
              {allAttempts.length > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousAttempt}
                    disabled={currentAttemptIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    Attempt {currentAttemptIndex + 1} of {allAttempts.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextAttempt}
                    disabled={currentAttemptIndex === allAttempts.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                    selectedResult.passed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {selectedResult.passed ? (
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {selectedResult.quizName}
                </h3>
                <p className="text-4xl font-bold text-primary mb-2">
                  {selectedResult.percentage}%
                </p>
                <p className="text-muted-foreground">
                  {selectedResult.passed
                    ? "Congratulations! You passed!"
                    : "Keep practicing and try again!"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-xl font-semibold">
                        {selectedResult.score}/{selectedResult.maxScore}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Correct Answers
                      </p>
                      <p className="text-xl font-semibold">
                        {selectedResult.correctAnswers}/
                        {selectedResult.totalQuestions}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Time Spent
                      </p>
                      <p className="text-xl font-semibold">
                        {selectedResult.timeSpentInMinutes} min
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Attempt</p>
                      <p className="text-xl font-semibold">
                        #{selectedResult.attemptNumber}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Completed on{" "}
                  {new Date(selectedResult.completedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedResult(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
