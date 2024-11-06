import { User } from '../../src/models/user-entity';
import { Question } from '../../src/models/question-entity';
import { Answer } from '../../src/models/answer-entity';
import { Vote } from '../../src/models/vote-entity';
import { TestDataSource } from '../../src/config/database-config';

describe('Entity Integration', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  beforeEach(async () => {
    await TestDataSource.manager.delete(Vote, {});
    await TestDataSource.manager.delete(Answer, {});
    await TestDataSource.manager.delete(Question, {});
    await TestDataSource.manager.delete(User, {});
  });

  it('should create entities with proper relationships', async () => {
    expect.hasAssertions();

    const user = new User();
    user.email = 'test@example.com';
    user.displayName = 'Test User';
    user.auth0Id = 'auth0Id';
    await TestDataSource.manager.save(user);

    expect(user.id).toBeDefined();

    const question = new Question();
    question.title = 'How to?';
    question.content = 'I want to...';
    question.author = user;
    await TestDataSource.manager.save(question);

    expect(question.id).toBeDefined();
    expect(question.author.id).toBe(user.id);

    const answer = new Answer();
    answer.content = "Here's how...";
    answer.author = user;
    answer.question = question;
    await TestDataSource.manager.save(answer);

    expect(answer.id).toBeDefined();
    expect(answer.author.id).toBe(user.id);
    expect(answer.question.id).toBe(question.id);

    const vote = new Vote();
    vote.value = 1;
    vote.user = user;
    vote.question = question;
    await TestDataSource.manager.save(vote);

    expect(vote.id).toBeDefined();
    expect(vote.user.id).toBe(user.id);
    expect(vote.question.id).toBe(question.id);

    const questionWithRelations = await TestDataSource.manager.findOne(Question, {
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
    await TestDataSource.manager.save(user1);

    const user2 = new User();
    user2.email = 'test@example.com';
    user2.displayName = 'Test User 2';
    user2.auth0Id = 'auth0Id';

    await expect(TestDataSource.manager.save(user2)).rejects.toThrow();
  });
});
