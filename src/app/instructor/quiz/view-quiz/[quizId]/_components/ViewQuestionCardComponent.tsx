import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Question } from "@/src/type/Quiz";
import React from "react";

const ViewQuestionCardComponent = ({
  questionIndex,
  question,
}: {
  questionIndex: number;
  question: Question;
}) => {
  return (
    <Card key={question.id}>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>
            {questionIndex + 1}. {question.content}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {question.score} {question.score === 1 ? "point" : "points"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.questionType == "MULTIPLE_CHOICE" ? (
            question.answers!.map((answer) => (
              <div
                key={answer.id}
                className={`flex items-center space-x-2 rounded-lg ${
                  answer.isCorrect && "bg-green-300"
                }`}
              >
                <Label
                  className="flex-1 cursor-pointer p-2 rounded hover:bg-muted/50"
                >
                  {answer.content}
                </Label>
              </div>
            ))
          ) : (
            <div
              className={`flex items-center space-x-2 rounded-lg`}
            >
              <Label
                className="flex-1 cursor-pointer p-2 rounded hover:bg-muted/50"
              >
                {question.trueFalseAnswer ? "True" : "False"}
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewQuestionCardComponent;
