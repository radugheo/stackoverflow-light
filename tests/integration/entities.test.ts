import { AppDataSource } from '../../src/config/database-config';
import { User } from '../../src/models/user-entity';
import { Question } from '../../src/models/question-entity';
import { Answer } from '../../src/models/answer-entity';
import { Vote } from '../../src/models/vote-entity';

describe('Entity Integration', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await AppDataSource.manager.delete(Vote, {});
    await AppDataSource.manager.delete(Answer, {});
    await AppDataSource.manager.delete(Question, {});
    await AppDataSource.manager.delete(User, {});
  });

  it('should create entities with proper relationships', async () => {
    expect.hasAssertions();

    const user = new User();
    user.email = 'test@example.com';
    user.displayName = 'Test User';
    user.auth0Id = 'auth0Id';
    await AppDataSource.manager.save(user);

    expect(user.id).toBeDefined();

    const question = new Question();
    question.title = 'How to?';
    question.content = 'I want to...';
    question.author = user;
    await AppDataSource.manager.save(question);

    expect(question.id).toBeDefined();
    expect(question.author.id).toBe(user.id);

    const answer = new Answer();
    answer.content = "Here's how...";
    answer.author = user;
    answer.question = question;
    await AppDataSource.manager.save(answer);

    expect(answer.id).toBeDefined();
    expect(answer.author.id).toBe(user.id);
    expect(answer.question.id).toBe(question.id);

    const vote = new Vote();
    vote.value = 1;
    vote.user = user;
    vote.question = question;
    await AppDataSource.manager.save(vote);

    expect(vote.id).toBeDefined();
    expect(vote.user.id).toBe(user.id);
    expect(vote.question.id).toBe(question.id);

    const questionWithRelations = await AppDataSource.manager.findOne(Question, {
      where: { id: question.id },
      relations: {
        author: true,
        answers: true,
        votes: true,
      },
    });

    expect(questionWithRelations).toBeDefined();
    expect(questionWithRelations?.author.id).toBe(user.id);
    expect(questionWithRelations?.answers).toHaveLength(1);
    expect(questionWithRelations?.votes).toHaveLength(1);
  });

  it('should enforce unique email constraint', async () => {
    expect.hasAssertions();

    const user1 = new User();
    user1.email = 'test@example.com';
    user1.displayName = 'Test User 1';
    user1.auth0Id = 'auth0Id';
    await AppDataSource.manager.save(user1);

    const user2 = new User();
    user2.email = 'test@example.com';
    user2.displayName = 'Test User 2';
    user2.auth0Id = 'auth0Id';

    await expect(AppDataSource.manager.save(user2)).rejects.toThrow();
  });
});
