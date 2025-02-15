const { prepareNextQuestion } = require('./state');
const { processAnswer, endGame } = require('./scoring');
const { startTimer, stopTimer } = require('./timer');

module.exports = {
    prepareNextQuestion,
    processAnswer,
    endGame,
    startTimer,
    stopTimer,
};
