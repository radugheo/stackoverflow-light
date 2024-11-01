export interface CreateQuestionDto {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdateQuestionDto {
  title?: string;
  content?: string;
}
