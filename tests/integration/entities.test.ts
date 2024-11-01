import { AppDataSource } from "../../src/config/database";
import { User } from "../../src/models/user-entity";
import { Question } from "../../src/models/question-entity";
import { Answer } from "../../src/models/answer-entity";
import { Vote } from "../../src/models/vote-entity";

async function testEntities() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        const user = new User();
        user.email = "test@example.com";
        user.displayName = "Test User";
        await AppDataSource.manager.save(user);
        console.log("User created:", user);

        const question = new Question();
        question.title = "How to ?";
        question.content = "I want to...";
        question.author = user;
        await AppDataSource.manager.save(question);
        console.log("Question created:", question);

        const answer = new Answer();
        answer.content = "Here's how...";
        answer.author = user;
        answer.question = question;
        await AppDataSource.manager.save(answer);
        console.log("Answer created:", answer);

        const vote = new Vote();
        vote.value = 1;
        vote.user = user;
        vote.question = question;
        await AppDataSource.manager.save(vote);
        console.log("Vote created:", vote);

        const questionWithRelations = await AppDataSource.manager.findOne(Question, {
            where: { id: question.id },
            relations: {
                author: true,
                answers: true,
                votes: true
            }
        });
        console.log("Question with relations:", questionWithRelations);

    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

testEntities();