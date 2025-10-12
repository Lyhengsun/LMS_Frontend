"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getCategoryAction } from "@/src/action/categoryAction";
import CustomFormField from "@/src/app/_components/CustomFormField";
import CustomSelectFormField from "@/src/app/_components/CustomSelectFormField";
import {
  createQuestionSchema,
  createQuizSchema,
} from "@/src/lib/zod/quizSchema";
import Category from "@/src/type/Category";
import { Question, QuestionRequest, QuizRequest } from "@/src/type/Quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import EditQuestionCardComponent from "../view-quiz/[quizId]/_components/EditQuestionCardComponent";
import EditFirstQuestionFormComponent from "./CreateFirstQuestionFormComponent";
import { createQuizActionForInstructor } from "@/src/action/quizAction";

const CreateQuizFormComponent = ({
  onOpenChange = (condition: boolean) => {},
}: {
  onOpenChange?: Function;
}) => {
  const quizForm = useForm<z.infer<typeof createQuizSchema>>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      quizName: "",
      quizDescription: "",
      quizInstruction: "",
      level: "BEGINNER",
      durationMinutes: "0",
      maxAttempts: "10",
      categoryId: "",
    },
  });

  const [formState, setFormState] = useState(1);
  const [quizRequest, setQuizRequest] = useState<QuizRequest>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newQuestions, setNewQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesRes = await getCategoryAction();

      if (categoriesRes.success) {
        setCategories(categoriesRes.data!);
      } else {
        toast.error("Failed to fetch Categories");
      }
    };
    loadCategories();
  }, []);

  const onSubmitQuizForm = async (values: z.infer<typeof createQuizSchema>) => {
    console.log("values : ", values);

    const maxAnswerId = 0;
    const newQuestion: Question = {
      id: 1,
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

    const newQuizRequest: QuizRequest = {
      quizName: values.quizName,
      quizDescription: values.quizDescription,
      quizInstruction: values.quizInstruction,
      level: values.level,
      durationMinutes: parseInt(values.durationMinutes),
      maxAttempts: parseInt(values.maxAttempts),
      categoryId: parseInt(values.categoryId),
      questions: [],
    };

    console.log("Submitted Quiz Request: ", newQuizRequest);
    setQuizRequest(newQuizRequest);
    setNewQuestions([newQuestion]);
    setFormState(2);
  };

  const onSubmitFirstQuestion = async () => {
    const mappedQuestions: QuestionRequest[] = newQuestions.map((question) => ({
      content: question.content,
      questionType: question.questionType,
      trueFalseAnswer: question.trueFalseAnswer,
      score: question.score,
      answers: question.answers?.map((answer) => ({
        content: answer.content,
        isCorrect: answer.isCorrect,
      })),
    }));

    setQuizRequest((prev) => ({
      ...prev!,
      questions: mappedQuestions,
    }));

    const newQuizRequest : QuizRequest = {
      ...quizRequest!,
      questions: mappedQuestions,
    }

    await createQuizActionForInstructor(newQuizRequest);
    toast.success("Create a new quiz successfully");
    onOpenChange(false);
  };

  // console.log(quizForm.formState.errors);

  return (
    <>
      {formState === 1 && (
        <Form {...quizForm}>
          <p className="flex flex-col space-y-1 my-4">
            <span className="text-3xl font-semibold">Quiz Info</span>
            <span className="text-sm text-gray-700">
              Enter the necessary details for a quiz
            </span>
          </p>

          <form
            onSubmit={quizForm.handleSubmit(onSubmitQuizForm)}
            className="space-y-4"
          >
            <CustomFormField
              control={quizForm.control}
              fieldName="quizName"
              label="Name of the Quiz"
              placeholder="Quiz Name"
            />

            <CustomFormField
              control={quizForm.control}
              fieldName="quizDescription"
              label="Description of the Quiz"
              placeholder="Quiz Description"
            />

            <CustomFormField
              control={quizForm.control}
              fieldName="quizInstruction"
              label="Instruction of the Quiz"
              placeholder="Quiz Instruction"
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomSelectFormField
                control={quizForm.control}
                fieldName="categoryId"
                label="Category"
                placeholder="Select a category"
                options={categories.map((c) => {
                  return { label: c.name, value: c.id.toString() };
                })}
              />

              <CustomSelectFormField
                control={quizForm.control}
                fieldName="level"
                label="Difficulty Level"
                placeholder="Pick a difficulty"
                options={[
                  { label: "Beginner", value: "BEGINNER" },
                  { label: "Intermediate", value: "INTERMEDIATE" },
                  { label: "Advance", value: "ADVANCE" },
                ]}
              />

              <CustomFormField
                control={quizForm.control}
                fieldName="durationMinutes"
                inputType="number"
                label="Duration Minutes"
                placeholder="Duration Minutes"
              />

              <CustomFormField
                control={quizForm.control}
                fieldName="maxAttempts"
                inputType="number"
                label="Max Attempts"
                placeholder="Max Attempts"
              />
            </div>

            <div className="w-full flex justify-end pt-4">
              <Button type="submit" className="flex items-center">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* {formState === 2 && (
        <Form {...firstQuestionForm}>
          <p className="flex flex-col space-y-1 my-4">
            <span className="text-3xl font-semibold">First Question Info</span>
            <span className="text-sm text-gray-700">
              Enter the necessary details for the first question of the quiz
            </span>
          </p>

          <form
            onSubmit={firstQuestionForm.handleSubmit(onSubmitFirstQuestion)}
          >
            <CustomFormField
              control={firstQuestionForm.control}
              fieldName="durationMinutes"
              inputType="number"
              label="Duration Minutes"
              placeholder="Duration Minutes"
            />

            <div className="w-full flex justify-end pt-4 items-center">
              <Button type="submit" className="flex items-center">
                Submit <Check className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      )} */}

      {formState === 2 && (
        <div>
          <p className="flex flex-col space-y-1 my-4">
            <span className="text-3xl font-semibold">First Question Info</span>
            <span className="text-sm text-gray-700">
              Enter the necessary details for the first question of the quiz
            </span>
          </p>

          <div>
            <EditFirstQuestionFormComponent
              questionIndex={0}
              question={newQuestions[0]}
              questions={newQuestions}
              setQuestions={setNewQuestions}
            />
          </div>

          <div className="w-full flex justify-end pt-4 items-center">
            <Button
              className="flex items-center"
              onClick={onSubmitFirstQuestion}
            >
              Submit <Check className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateQuizFormComponent;
