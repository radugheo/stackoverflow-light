export interface CreateQuestionDto {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdateQuestionDto {
  title?: string;
  content?: string;
}

export interface FindQuestionsOptions {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'popular';
}
