"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Answer, Question } from "@/src/type/Quiz";
import EditAnswerInputComponent from "./EditAnswerInputComponent";
import useDebounce from "@/src/lib/hooks/useDebounce";

const EditQuestionCardComponent = ({
  questionIndex,
  question,
  questions,
  setQuestions,
}: {
  questionIndex: number;
  question: Question;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const [questionInputString, setQuestionInputString] = useState(
    question.content
  );
  const questionInputDebounce = useDebounce(questionInputString, 300);

  useEffect(() => {
    updateQuestion(question.id, "content", questionInputDebounce);
  }, [questionInputDebounce]);

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, [field]: value, editedAt: new Date().toISOString() }
          : q
      )
    );
  };

  const updateTrueFalseQuestion = (id: number, trueFalse: boolean) => {
    console.log("updateTrueFalseQuestion : ", trueFalse);
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, trueFalseAnswer: trueFalse } : q
      )
    );
  };

  const resetAnswerCheck = (questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers!.map((a) => {
                return {
                  ...a,
                  isCorrect: false,
                };
              }),
            }
          : q
      )
    );
  };

  const updateAnswer = (
    questionId: number,
    answerId: number,
    field: keyof Answer,
    value: string | boolean
  ) => {
    resetAnswerCheck(questionId);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers!.map((answer) =>
                answer.id === answerId
                  ? {
                      ...answer,
                      [field]: value,
                      editedAt: new Date().toISOString(),
                    }
                  : answer
              ),
              editedAt: new Date().toISOString(),
            }
          : q
      )
    );
  };

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleQuestionTypeChange = (
    questionId: number,
    newType: "MULTIPLE_CHOICE" | "TRUE_FALSE"
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          if (newType === "TRUE_FALSE") {
            return {
              ...q,
              questionType: newType,
              answers: undefined,
              editedAt: new Date().toISOString(),
            };
          } else {
            const maxAnswerId =
              q.answers == undefined
                ? 1
                : Math.max(
                    ...questions.flatMap((q) => q.answers!.map((a) => a.id))
                  );
            // Keep existing answers if switching back to multiple choice
            return {
              ...q,
              questionType: newType,
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
          }
        }
        return q;
      })
    );
  };

  const addAnswer = (questionId: number) => {
    const maxAnswerId = Math.max(
      ...questions.flatMap((q) => q.answers!.map((a) => a.id))
    );
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers!,
                {
                  id: maxAnswerId + 1,
                  content: `Option ${q.answers!.length + 1}`,
                  isCorrect: false,
                  createdAt: new Date().toISOString(),
                  editedAt: new Date().toISOString(),
                },
              ],
              editedAt: new Date().toISOString(),
            }
          : q
      )
    );
  };

  const removeAnswer = (questionId: number, answerId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.answers!.length > 2
          ? {
              ...q,
              answers: q.answers!.filter((answer) => answer.id !== answerId),
              editedAt: new Date().toISOString(),
            }
          : q
      )
    );
  };

  return (
    <Card key={question.id}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-4">
            <div>
              <Label
                htmlFor={`question-${question.id}`}
                className="text-sm font-medium"
              >
                Question {questionIndex + 1}
              </Label>
              <Textarea
                id={`question-${question.id}`}
                value={questionInputString}
                onChange={(e) => setQuestionInputString(e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Question Type</Label>
                <Select
                  value={question.questionType}
                  onValueChange={(value: "MULTIPLE_CHOICE" | "TRUE_FALSE") =>
                    handleQuestionTypeChange(question.id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label className="text-sm font-medium">Score</Label>
                <Input
                  type="number"
                  min="1"
                  value={question.score}
                  onChange={(e) =>
                    updateQuestion(
                      question.id,
                      "score",
                      Number.parseInt(e.target.value) || 1
                    )
                  }
                />
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteQuestion(question.id)}
            disabled={questions.length <= 1}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Answer Options</Label>
          <div className="space-y-2 mt-2">
            {question.questionType == "MULTIPLE_CHOICE" ? (
              question.answers!.map((answer) => (
                <EditAnswerInputComponent
                  key={answer.id}
                  question={question}
                  answer={answer}
                  updateAnswer={updateAnswer}
                  removeAnswer={removeAnswer}
                />
              ))
            ) : (
              <>
                <div className="flex items-center gap-4 pt-2">
                  <Checkbox
                    checked={question.trueFalseAnswer}
                    onCheckedChange={(checked) => {
                      updateTrueFalseQuestion(question.id, true);
                    }}
                  />
                  <Label>True</Label>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Checkbox
                    checked={!question.trueFalseAnswer}
                    onCheckedChange={(checked) => {
                      updateTrueFalseQuestion(question.id, false);
                    }}
                  />
                  <Label>False</Label>
                </div>
              </>
            )}
          </div>
          {question.questionType === "MULTIPLE_CHOICE" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addAnswer(question.id)}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {question.questionType === "TRUE_FALSE"
            ? "For True/False questions, check the correct answer"
            : "Check the boxes next to the correct answer(s)"}
        </p>
      </CardContent>
    </Card>
  );
};

export default EditQuestionCardComponent;
