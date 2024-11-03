export interface Metrics {
  mostPopularPost: {
    questionId: string;
    title: string;
    votes: number;
    answers: number;
    popularity: number;
  };
  averages: {
    questionsPerUser: number;
    answersPerUser: number;
    votesPerUser: number;
  };
  totals: {
    questions: number;
    answers: number;
    votes: number;
    users: number;
  };
}
