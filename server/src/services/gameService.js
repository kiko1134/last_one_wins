const { games, questionsDB } = require('../models/data');
const { prepareNextQuestion, processAnswer, endGame } = require('../../../game-logic');

module.exports = {
    prepareNextQuestion: (game) => prepareNextQuestion(game, questionsDB),

    processAnswer: (data) => {
        const game = games[data.gameID];
        return processAnswer(game, questionsDB, data);
    },

    endGame: (io, gameID) => {
        const game = games[gameID];
        endGame(io, game);
    },
};
