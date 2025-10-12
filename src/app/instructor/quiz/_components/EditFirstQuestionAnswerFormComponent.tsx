"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useDebounce from "@/src/lib/hooks/useDebounce";
import { Answer, Question } from "@/src/type/Quiz";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const EditFirstQuestionAnswerFormComponent = ({
  question,
  answer,
  updateAnswer,
  removeAnswer,
}: {
  question: Question;
  answer: Answer;
  updateAnswer: (
    questionId: number,
    answerId: number,
    field: keyof Answer,
    value: string | boolean
  ) => void;
  removeAnswer: (questionId: number, answerId: number) => void;
}) => {
  const [inputString, setInputString] = useState(answer.content);
  const debounceInput = useDebounce(inputString, 300);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      console.log("typing");
      if (debounceInput !== answer.content) {
        // Only update if the debounced value is different from the current answer content
        updateAnswer(question.id, answer.id, "content", debounceInput);
      }
    }
    return () => {
      ignore = true;
    };
  }, [debounceInput, question.id, answer.id, answer.content]);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={answer.isCorrect}
        onCheckedChange={(checked) => {
          if (checked === true) {
            updateAnswer(question.id, answer.id, "isCorrect", checked === true);
          }
        }}
      />
      <Input
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        className="flex-1"
        disabled={question.questionType === "TRUE_FALSE"}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => removeAnswer(question.id, answer.id)}
        disabled={
          question.answers!.length <= 2 ||
          question.questionType === "TRUE_FALSE"
        }
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default EditFirstQuestionAnswerFormComponent;
