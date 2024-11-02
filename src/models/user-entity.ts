import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Question } from './question-entity';
import { Answer } from './answer-entity';
import { Vote } from './vote-entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  auth0Id!: string;

  @Column({ length: 100 })
  displayName!: string;

  @OneToMany(() => Question, (question) => question.author, { nullable: true })
  questions?: Question[];

  @OneToMany(() => Answer, (answer) => answer.author, { nullable: true })
  answers?: Answer[];

  @OneToMany(() => Vote, (vote) => vote.user, { nullable: true })
  votes?: Vote[];

  @CreateDateColumn()
  created: Date;
}
