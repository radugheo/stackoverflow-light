export interface CreateVoteDto {
  userId: string;
  value: 1 | -1;
  questionId?: string;
  answerId?: string;
}
