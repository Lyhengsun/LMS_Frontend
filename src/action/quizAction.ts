"use server";

import { revalidateTag } from "next/cache";
import {
  createQuizServiceForInstructor,
  deleteQuizByIdForInstructorService,
  getQuizServiceForInstructor,
  getQuizzesForStudentService,
  studentDeleteTakeQuizByIdService,
  studentGetQuizResultByQuizIdService,
  studentSubmitQuizService,
  studentTakeQuizService,
  updateQuizServiceForInstructor,
} from "../service/quiz.service";
import { QuizRequest } from "../type/Quiz";
import ApiResponse from "../type/ApiResponse";

export const getQuizActionForInstructor = async (
  page: number = 1,
  size: number = 10,
  quizName: string | undefined
) => {
  try {
    const data = await getQuizServiceForInstructor(page, size, quizName);
    revalidateTag("instructorQuizzes");
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const updateQuizActionForInstructor = async (
  quizId: number,
  request: QuizRequest
) => {
  try {
    const data = await updateQuizServiceForInstructor(quizId, request);
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const deleteQuizByIdForInstructorAction = async (quizId: number) => {
  try {
    const data: ApiResponse<null> | undefined =
      await deleteQuizByIdForInstructorService(quizId);

    if (data?.success) {
      return { success: true, message: data.message };
    }
    return { success: false, message: data?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const createQuizActionForInstructor = async (request: QuizRequest) => {
  try {
    const data = await createQuizServiceForInstructor(request);
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getQuizzesForStudentAction = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined,
  categoryId: number | undefined = undefined,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | undefined = undefined,
  quizProperty: "CREATED_AT" | "QUIZ_NAME" = "CREATED_AT",
  direction: "ASC" | "DESC" = "ASC"
) => {
  try {
    const data = await getQuizzesForStudentService(
      page,
      size,
      name,
      categoryId,
      level,
      quizProperty,
      direction
    );
    revalidateTag("studentQuizzes");
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const studentTakeQuizAction = async (quizId: number) => {
  try {
    const data = await studentTakeQuizService(quizId);
    if (data?.success) {
      return { success: true, data: data.payload };
    }
    return { success: false, message: data?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const studentDeleteTakeQuizByIdAction = async (takeQuizId: number) => {
  try {
    const data = await studentDeleteTakeQuizByIdService(takeQuizId);
    if (data?.success) {
      return { success: true, message: data.message };
    }
    return { success: false, message: data?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const studentSubmitQuizAction = async (
  takeQuizId: number,
  answerIds: number[]
) => {
  try {
    const data = await studentSubmitQuizService(takeQuizId, answerIds);

    if (data?.success) {
      return { success: true, message: data.message };
    }
    return { success: false, message: data?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const studentGetQuizResultByQuizIdAction = async (quizId: number) => {
  try {
    const data = await studentGetQuizResultByQuizIdService(quizId);

    if (data?.success) {
      return { success: true, data: data.payload };
    }
    return { success: false, message: data?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};
