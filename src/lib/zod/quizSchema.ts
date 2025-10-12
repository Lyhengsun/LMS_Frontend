import z from "zod";

export const createQuizSchema = z.object({
  quizName: z.string().trim().min(2, "Quiz Name is required"),
  quizDescription: z.string().trim().min(1, "Quiz Description is required"),
  quizInstruction: z.string().trim().min(1, "Quiz Instruction is required"),
  level: z.enum(
    ["BEGINNER", "INTERMEDIATE", "ADVANCE"],
    "Only BEGINNER, INTERMEDIATE, ADVANCE is allowed"
  ),
  durationMinutes: z.string().trim(),
  maxAttempts: z.string().trim(),
  categoryId: z.string().trim().min(1, "Category is required"),
});

export const createQuestionSchema = z.object({
  content: z.string().trim(),
  questionType: z.enum(
    ["MULTIPLE_CHOICE", "TRUE_FALSE"],
    "Only MULTIPLE_CHOICE and TRUE_FALSE is allowed"
  ),
  trueFalseAnswer: z.boolean().optional(),
  score: z.string().trim(),
});

export const createAnswerSchema = z.object({
  content: z.string().trim(),
  isCorrect: z.boolean(),
});
