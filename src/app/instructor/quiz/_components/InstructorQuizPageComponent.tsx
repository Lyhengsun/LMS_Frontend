"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QuizCardComponent from "./QuizCardComponent";
import { getQuizActionForInstructor } from "@/src/action/quizAction";
import { toast } from "sonner";
import useDebounce from "@/src/lib/hooks/useDebounce";
import { Quiz, QuizRequest } from "@/src/type/Quiz";
import CreateQuizFormComponent from "./CreateQuizFormComponent";
import { useInView } from "react-intersection-observer";

const InstructorQuizPageComponent = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { ref, inView } = useInView();

  const debounceSearch = useDebounce(searchTerm, 300);

  const loadQuizzes = async () => {
    const data = await getQuizActionForInstructor(page, 10, debounceSearch);
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
    if (page === 1) {
      const newLoadedQuiz = await loadQuizzes();
      setQuizzes(newLoadedQuiz!);
    }
    if (oldPage < page) {
      const newLoadedQuiz = await loadQuizzes();
      setQuizzes((prevQuizzes) => [...prevQuizzes, ...newLoadedQuiz!]);
    }
    setOldPage(page);
  };

  // Load quizzes when page changes
  useEffect(() => {
    console.log("load quiz");
    updateQuizzes();
  }, [page]);

  // Trigger page increment when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage) {
      setPage(page + 1);
    }
  }, [inView]);

  // Reset and reload when search term changes
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
  }, [debounceSearch]);

  // Reload quizzes when dialog closes (after creating a new quiz)
  useEffect(() => {
    if (!isCreateDialogOpen) {
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
    }
  }, [isCreateDialogOpen]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Quizzes</h1>
            <p className="text-gray-600 mt-1">
              Create and manage course quizzes
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Search and Create Button */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                style={{ backgroundColor: "hsl(var(--instructor-primary))" }}
                className="text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
              </DialogHeader>
              <CreateQuizFormComponent 
                onOpenChange={setIsCreateDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Quizzes Grid - Two Columns */}
        <div className="space-y-4 grid grid-cols-2 gap-x-4">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id}>
              {index === quizzes.length - 1 && hasNextPage && (
                <div ref={ref}></div>
              )}
              <QuizCardComponent quiz={quiz} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm !== "" 
                ? "No quizzes found matching your search." 
                : "No quizzes available. Create your first quiz!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorQuizPageComponent;
