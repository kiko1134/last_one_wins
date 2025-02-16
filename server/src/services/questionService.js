import Question from '../models/Question.js';

export async function getRandomQuestions(count = 3) {
    try {
        return await Question.aggregate([{$sample: {size: count}}]);
    } catch (error) {
        console.error("Грешка при извличане на случайни въпроси:", error);
        throw error;
    }
}
