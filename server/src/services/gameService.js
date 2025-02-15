import { games, questionsDB } from '../models/data.js';
import * as state from '../../../game-logic/state.mjs';
import * as scoring from '../../../game-logic/scoring.mjs';

const { processAnswer, endGame } = scoring;
const { prepareNextQuestion } = state;

export function prepareNextQuestionService(game) { return prepareNextQuestion(game, questionsDB); }
export function processAnswerService(data) {
    const game = games[data.gameID];
    return processAnswer(game, questionsDB, data);
}
export function endGameService(io, gameID) {
    const game = games[gameID];
    endGame(io, game);
}
