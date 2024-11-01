import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user-entity';
import { Question } from './question-entity';
import { Vote } from './vote-entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  question!: Question;

  @ManyToOne(() => User, (user) => user.answers)
  author!: User;

  @OneToMany(() => Vote, (vote) => vote.answer, { nullable: true })
  votes?: Vote[];

  @Column({ default: 0 })
  voteCount: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
