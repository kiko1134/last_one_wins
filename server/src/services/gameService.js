import { games } from '../models/data.js';
import * as state from '../../../game-logic/state.mjs';
import * as scoring from '../../../game-logic/scoring.mjs';
import Game from "../models/Game.js";

const { processAnswer, endGame } = scoring;
const { prepareNextQuestion } = state;

export function prepareNextQuestionService(game) {
    return prepareNextQuestion(game);
}

export function processAnswerService(data) {
    const game = games[data.gameID];
    return processAnswer(game, data);
}

export async function endGameService(io, gameID) {
    const game = games[gameID];
    const sortedPlayers = game.players.slice().sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];
    // Използваме просто id-то на победителя от in-memory обекта,
    // ако не съществува – използваме username като резервно решение.
    const winnerID = winner.username;

    console.log("Game ended. Winner:", winnerID, winner);

    try {
        const newGameRecord = new Game({
            gameID: gameID,
            winnerID: winner.username,
        });
        await newGameRecord.save();
        console.log("Game record saved in DB:", { gameID, winnerID });
    } catch (err) {
        console.error("Error saving game record:", err);
    }

    endGame(io, game);
}