export interface CreateAnswerDto {
  content: string;
  authorId: string;
  questionId: string;
}

export interface UpdateAnswerDto {
  content: string;
}
