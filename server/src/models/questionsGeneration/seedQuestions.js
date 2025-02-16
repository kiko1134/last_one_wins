// seedQuestions.js
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from '../Question.js';

// Идеяята на този файл е генериране на върпосите в базата данни!!!

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uri = "mongodb+srv://kristianyordanov156:Hvt6Bc9m6JczVWJk@cluster0.555sa.mongodb.net/LastOneWins?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    useNewUrlParser: true,
    useUnifiedTopology: true
};

async function seedQuestions() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB!");

        const filePath = path.join(__dirname, 'questions.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const questions = JSON.parse(data);

        // За всеки въпрос създаваме инстанция и я запазваме, за да се задейства pre-save hook-а на плъгина. В противен случай id-то няма да се инкрементира, като цяло няма да се изпълни.
        for (const q of questions) {
            const newQuestion = new Question(q);
            await newQuestion.save();
            console.log(`Question saved: ${newQuestion.title} with id ${newQuestion.id}`);
        }

        console.log("Questions seeded successfully!");
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("Error seeding questions:", error);
    }
}

seedQuestions();
