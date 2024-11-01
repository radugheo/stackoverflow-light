import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user-entity';
import { Question } from './question-entity';
import { Answer } from './answer-entity';

@Entity('votes')
@Unique(['user', 'question'])
@Unique(['user', 'answer'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'smallint' })
  value!: number;

  @ManyToOne(() => User, (user) => user.votes)
  user!: User;

  @ManyToOne(() => Question, (question) => question.votes, { nullable: true })
  question?: Question;

  @ManyToOne(() => Answer, (answer) => answer.votes, { nullable: true })
  answer?: Answer;

  @CreateDateColumn()
  created: Date;
}
