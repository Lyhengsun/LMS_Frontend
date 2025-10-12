import { number } from "zod";
import headerToken from "../app/api/headerToken";
import ApiResponse from "../type/ApiResponse";
import { Pagination } from "../type/Pagination";
import { Quiz, QuizDetails, QuizRequest, QuizResult, TakeQuiz } from "../type/Quiz";

export const getQuizById = async (quizId: number) => {
  const url = `${process.env.BASE_API_URL}/quizzes/${quizId}`;

  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      next: {
        tags: ["quiz"],
      },
    });

    const data = await res.json();

    const item = data.payload as QuizDetails;

    return item;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizServiceForInstructor = async (
  page: number = 1,
  size: number = 10,
  quizName: string | undefined
) => {
  let url = `${process.env.BASE_API_URL}/instructors/quizzes?page=${page}&size=${size}`;
  if (quizName) {
    url += `&name=${quizName}`;
  }
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      next: {
        tags: ["instructorQuizzes"],
      },
    });

    const data = await res.json();

    const { items, pagination } = data.payload as {
      items: Quiz[];
      pagination: Pagination;
    };

    return { items, pagination };
  } catch (error) {
    console.log(error);
  }
};

export const updateQuizServiceForInstructor = async (
  quizId: number,
  request: QuizRequest
) => {
  const url = `${process.env.BASE_API_URL}/instructors/quizzes/${quizId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        ...(header as HeadersInit),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await res.json();

    console.log("updateQuizServiceForInstructor : ", data);

    return data.payload as QuizDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createQuizServiceForInstructor = async (request: QuizRequest) => {
  const url = `${process.env.BASE_API_URL}/instructors/quizzes`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(header as HeadersInit),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await res.json();

    console.log("createQuizServiceForInstructor : ", data);

    return data.payload as QuizDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuizByIdForInstructorService = async (quizId: number) => {
  const url = `${process.env.BASE_API_URL}/instructors/quizzes/${quizId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "DELETE",
    });

    const data: ApiResponse<null> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizzesForStudentService = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined,
  categoryId: number | undefined = undefined,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | undefined = undefined,
  quizProperty: "CREATED_AT" | "QUIZ_NAME" = "CREATED_AT",
  direction: "ASC" | "DESC" = "ASC"
) => {
  const url = `${process.env.BASE_API_URL}/quizzes?page=${page}&size=${size}`;
  let concatenatedUrl = url;

  if (name != undefined && name.trim().length > 0) {
    concatenatedUrl += `&name=${name}`;
  }
  if (categoryId != undefined) {
    concatenatedUrl += `&categoryId=${categoryId}`
  }
  if (level != undefined) {
    concatenatedUrl += `&level=${level}`;
  }
  if (quizProperty != undefined) {
    concatenatedUrl += `&quizProperty=${quizProperty}`;
  }
  if (direction != undefined) {
    concatenatedUrl += `&direction=${direction}`;
  }

  const header = await headerToken();
  try {
    const res = await fetch(concatenatedUrl, {
      headers: header as HeadersInit,
      next: {
        tags: ["studentQuizzes"],
      },
    });
    const data = await res.json();

    return data.payload as {
      items: Quiz[];
      pagination: Pagination;
    };
  } catch (error) {
    console.log(error);
  }
};

export const studentGetTakeQuizByIdService = async (takeQuizId: number) => {
  const url = `${process.env.BASE_API_URL}/students/quizzes/taken/${takeQuizId}`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });

    const data: ApiResponse<TakeQuiz> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const studentTakeQuizService = async (quizId: number) => {
  const url = `${process.env.BASE_API_URL}/students/quizzes/${quizId}/taken`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: header as HeadersInit,
    });

    const data: ApiResponse<TakeQuiz> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const studentDeleteTakeQuizByIdService = async (takeQuizId: number) => {
  const url = `${process.env.BASE_API_URL}/students/quizzes/taken/${takeQuizId}`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: header as HeadersInit,
    });

    const data: ApiResponse<null> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const studentSubmitQuizService = async (
  takeQuizId: number,
  answerIds: number[]
) => {
  const url = `${process.env.BASE_API_URL}/students/quizzes/taken/${takeQuizId}/submit?answerIds=${answerIds}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "POST",
    });

    const data : ApiResponse<null> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const studentGetQuizResultByQuizIdService = async (quizId: number) => {
  const url = `${process.env.BASE_API_URL}/students/quizzes/${quizId}/result`;
  const header = await headerToken();
  
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit
    })

    const data : ApiResponse<QuizResult[]> = await res.json();
    return data;
  } catch (error) {
    console.log(error)
  }
}
