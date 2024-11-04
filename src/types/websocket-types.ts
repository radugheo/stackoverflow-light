export enum WebSocketEvents {
  QUESTION_CREATED = 'questionCreated',
  QUESTION_UPDATED = 'questionUpdated',
  QUESTION_DELETED = 'questionDeleted',
  QUESTION_VOTED = 'questionVoted',
  QUESTION_ANSWERED = 'questionAnswered',

  ANSWER_CREATED = 'answerCreated',
  ANSWER_UPDATED = 'answerUpdated',
  ANSWER_DELETED = 'answerDeleted',
  ANSWER_VOTED = 'answerVoted',
}

interface QuestionEventData {
  id: string;
  title: string;
  content: string;
  authorId: string;
  voteCount: number;
  answerCount: number;
}

interface AnswerEventData {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  voteCount: number;
}

export type WebSocketEventData = {
  [WebSocketEvents.QUESTION_CREATED]: QuestionEventData;
  [WebSocketEvents.QUESTION_UPDATED]: QuestionEventData;
  [WebSocketEvents.QUESTION_DELETED]: { id: string };
  [WebSocketEvents.QUESTION_VOTED]: QuestionEventData;
  [WebSocketEvents.QUESTION_ANSWERED]: QuestionEventData;
  [WebSocketEvents.ANSWER_CREATED]: AnswerEventData;
  [WebSocketEvents.ANSWER_UPDATED]: AnswerEventData;
  [WebSocketEvents.ANSWER_DELETED]: { id: string; questionId: string };
  [WebSocketEvents.ANSWER_VOTED]: AnswerEventData;
};
