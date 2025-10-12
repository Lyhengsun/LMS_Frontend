import React from "react";
import TakeQuizPageComponent from "./_components/TakeQuizPageComponent";
import { getQuizById, studentGetTakeQuizByIdService } from "@/src/service/quiz.service";
import { redirect } from "next/navigation";

const TakeQuizPage = async ({
  params,
}: {
  params: Promise<{ takeQuizId: string }>;
}) => {
  const { takeQuizId } = await params;

  const takeQuizResponse = await studentGetTakeQuizByIdService(parseInt(takeQuizId));

  if (takeQuizResponse == undefined || !takeQuizResponse.success) {
    redirect("/quiz");
  }

  const quiz = await getQuizById(takeQuizResponse.payload.quiz.id);

  return <TakeQuizPageComponent takeQuiz={takeQuizResponse.payload} quizDetail={quiz!} />;
};

export default TakeQuizPage;
