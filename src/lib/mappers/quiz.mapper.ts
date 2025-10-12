import { Quiz, QuizDetails, QuizRequest, Question, QuestionRequest, Answer, AnswerRequest } from "@/src/type/Quiz";

/**
 * Maps an Answer object to an AnswerRequest object
 * @param answer - The Answer object to map
 * @returns The mapped AnswerRequest object
 */
export function mapAnswerToAnswerRequest(answer: Answer): AnswerRequest {
  return {
    content: answer.content,
    isCorrect: answer.isCorrect,
  };
}

/**
 * Maps a Question object to a QuestionRequest object
 * @param question - The Question object to map
 * @returns The mapped QuestionRequest object
 */
export function mapQuestionToQuestionRequest(question: Question): QuestionRequest {
  return {
    content: question.content,
    questionType: question.questionType,
    trueFalseAnswer: question.trueFalseAnswer,
    score: question.score,
    answers: question.answers?.map(mapAnswerToAnswerRequest),
  };
}

/**
 * Maps a QuizDetails object to a QuizRequest object
 * @param quiz - The QuizDetails object to map
 * @returns The mapped QuizRequest object
 */
export function mapQuizDetailsToQuizRequest(quiz: QuizDetails): QuizRequest {
  return {
    quizName: quiz.quizName,
    quizDescription: quiz.quizDescription,
    quizInstruction: quiz.quizInstruction,
    level: quiz.level,
    durationMinutes: quiz.durationMinutes,
    maxAttempts: quiz.maxAttempts,
    passingScore: quiz.passingScore,
    categoryId: quiz.category.id,
    questions: quiz.questions.map(mapQuestionToQuestionRequest),
  };
}

/**
 * Maps a basic Quiz object to a QuizRequest object
 * Note: This function requires categoryId to be provided separately since
 * the basic Quiz type doesn't include category information
 * @param quiz - The Quiz object to map
 * @param categoryId - The category ID to include in the request
 * @param questions - The questions to include in the request
 * @returns The mapped QuizRequest object
 */
export function mapQuizToQuizRequest(
  quiz: Quiz,
  questions: QuestionRequest[] = []
): QuizRequest {
  return {
    quizName: quiz.quizName,
    quizDescription: quiz.quizDescription,
    quizInstruction: quiz.quizInstruction,
    level: quiz.level,
    durationMinutes: quiz.durationMinutes,
    maxAttempts: quiz.maxAttempts,
    passingScore: quiz.passingScore,
    categoryId: quiz.category.id,
    questions: questions,
  };
}

/**
 * Maps a QuizDetails object to a Quiz object
 * @param quizDetails - The QuizDetails object to map
 * @returns The mapped Quiz object
 */
export function mapQuizDetailsToQuiz(quizDetails: QuizDetails): Quiz {
  return {
    createdAt: quizDetails.createdAt,
    editedAt: quizDetails.editedAt,
    id: quizDetails.id,
    quizName: quizDetails.quizName,
    quizDescription: quizDetails.quizDescription,
    quizInstruction: quizDetails.quizInstruction,
    level: quizDetails.level,
    durationMinutes: quizDetails.durationMinutes,
    maxAttempts: quizDetails.maxAttempts,
    passingScore: quizDetails.passingScore,
    questionCount: quizDetails.questions.length,
    category: quizDetails.category
    // Assuming questionCount is the number of questions
  };
}
