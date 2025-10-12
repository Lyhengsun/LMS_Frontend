"use client";
import { Button } from "@/components/ui/button";
import { Question, QuizDetails, QuizRequest } from "@/src/type/Quiz";
import { ArrowLeft, Edit, Plus, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditQuestionCardComponent from "./EditQuestionCardComponent";
import ViewQuestionCardComponent from "./ViewQuestionCardComponent";
import { updateQuizActionForInstructor } from "@/src/action/quizAction";
import {
  mapQuestionToQuestionRequest,
  mapQuizDetailsToQuiz,
  mapQuizDetailsToQuizRequest,
  mapQuizToQuizRequest,
} from "@/src/lib/mappers/quiz.mapper";
import { toast } from "sonner";

const ViewQuizDetailPageComponent = ({ quiz }: { quiz: QuizDetails }) => {
  const router = useRouter();
  const [originalQuestion, setOriginalQuestions] = useState<Question[]>(
    quiz.questions
  );
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [isSaveMode, setIsSaveMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: number]: number[];
  }>({});

  useEffect(() => {
    setIsSaveMode(true);
  }, [questions]);

  const handleSaveEditQuiz = async () => {
    const request: QuizRequest = mapQuizToQuizRequest(
      mapQuizDetailsToQuiz(quiz),
      questions.map((m) => mapQuestionToQuestionRequest(m))
    );
    const savedEditQuizRes = await updateQuizActionForInstructor(
      quiz.id,
      request
    );

    console.log("savedEditQuizRes : ", savedEditQuizRes);

    if (savedEditQuizRes.success) {
      setIsEditMode(false);
      setIsSaveMode(false);
    } else {
      toast.error("Failed to load courses for current author");
    }
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    const maxAnswerId = Math.max(
      ...questions.flatMap((q) =>
        q.answers == undefined ? 1 : q.answers!.map((a) => a.id)
      )
    );
    const newQuestion: Question = {
      id: newId,
      content: "New Question",
      questionType: "MULTIPLE_CHOICE",
      trueFalseAnswer: false,
      score: 1,
      createdAt: new Date().toISOString(),
      editedAt: new Date().toISOString(),
      answers: [
        {
          id: maxAnswerId + 1,
          content: "Option 1",
          isCorrect: false,
          createdAt: new Date().toISOString(),
          editedAt: new Date().toISOString(),
        },
        {
          id: maxAnswerId + 2,
          content: "Option 2",
          isCorrect: true,
          createdAt: new Date().toISOString(),
          editedAt: new Date().toISOString(),
        },
        {
          id: maxAnswerId + 3,
          content: "Option 3",
          isCorrect: false,
          createdAt: new Date().toISOString(),
          editedAt: new Date().toISOString(),
        },
        {
          id: maxAnswerId + 4,
          content: "Option 4",
          isCorrect: false,
          createdAt: new Date().toISOString(),
          editedAt: new Date().toISOString(),
        },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    const newAnswers = { ...selectedAnswers };
    if (!newAnswers[questionId]) {
      newAnswers[questionId] = [];
    }

    const currentSelections = newAnswers[questionId];
    if (currentSelections.includes(answerId)) {
      newAnswers[questionId] = currentSelections.filter(
        (id) => id !== answerId
      );
    } else {
      newAnswers[questionId] = [...currentSelections, answerId];
    }

    setSelectedAnswers(newAnswers);
  };

  let pageComponent = null;

  if (isEditMode) {
    pageComponent = (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Edit Quiz Questions</h1>
            <div className="space-x-2">
              <Button onClick={addQuestion} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
              <Button
                onClick={() => {
                  setQuestions(originalQuestion);
                  setIsEditMode(false);
                }}
              >
                <XIcon className="w-4 h-4 mr-2" />
                Cancel Edit
              </Button>
            </div>
          </div>

          {questions.map((question, questionIndex) => (
            <EditQuestionCardComponent
              key={question.id}
              questionIndex={questionIndex}
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          ))}

          <div className="w-full flex justify-end">
            {isSaveMode && <Button onClick={handleSaveEditQuiz}>Save</Button>}
          </div>
        </div>
      </div>
    );
  } else {
    pageComponent = (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Quiz - All Questions</h1>
            <Button variant="outline" onClick={() => setIsEditMode(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <ViewQuestionCardComponent
                key={question.id}
                questionIndex={questionIndex}
                question={question}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{quiz.quizName}</h1>
          </div>
        </div>
      </div>
      {pageComponent}
    </div>
  );
};

export default ViewQuizDetailPageComponent;
