import { getQuizById } from '@/src/service/quiz.service';
import React from 'react'
import ViewQuizDetailPageComponent from './_components/ViewQuizDetailPageComponent';

const InstructorViewQuizDetailPage = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) => {
  const { quizId } = await params;

  const quiz = await getQuizById(parseInt(quizId));
  return (
    <ViewQuizDetailPageComponent quiz={quiz!} />
  )
}

export default InstructorViewQuizDetailPage