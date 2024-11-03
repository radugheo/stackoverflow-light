import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer-entity';
import { User } from './user-entity';
import { Vote } from './vote-entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  @Index()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => User, (user) => user.questions)
  author!: User;

  @OneToMany(() => Answer, (answer) => answer.question, { nullable: true })
  answers?: Answer[];

  @OneToMany(() => Vote, (vote) => vote.question, { nullable: true })
  votes?: Vote[];

  @Column({ default: 0 })
  @Index()
  voteCount: number;

  @Column({ default: 0 })
  answerCount: number;

  @Column({ type: 'float', default: 0 })
  @Index()
  popularity!: number;

  @CreateDateColumn()
  @Index()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
