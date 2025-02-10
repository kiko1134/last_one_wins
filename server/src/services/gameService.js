const { games, questionsDB } = require('../models/data');

function prepareNextQuestion(game) {
    const currentRoundKey = `round${game.currentRound}`;
    // If there is next question for the current topic
    if (
        questionsDB[currentRoundKey] &&
        questionsDB[currentRoundKey].topics[game.currentTopic] &&
        questionsDB[currentRoundKey].topics[game.currentTopic].questions[game.currentQuestion + 1]
    ) {
        game.currentQuestion++;
    }
    // If there are not, check for next topic in the current round
    else if (
        questionsDB[currentRoundKey] &&
        questionsDB[currentRoundKey].topics[game.currentTopic + 1]
    ) {
        game.currentTopic++;
        game.currentQuestion = 1;
    }
    // If there are not next questions in the current round - check for the next round
    else if (questionsDB[`round${game.currentRound + 1}`]) {
        game.currentRound++;
        game.currentTopic = 1;
        game.currentQuestion = 1;
    } else {
        // No questions - end game
        return false;
    }
    // Restart elimination state for every player
    game.players.forEach(player => player.eliminated = false);
    return true;
}

function processAnswer({ gameID, username, answer, round, topic, questionID }) {
    if (!gameID || !games[gameID]) {
        return { error: "Играта не е намерена" };
    }
    const game = games[gameID];
    const roundKey = `round${round}`;
    if (
        !questionsDB[roundKey] ||
        !questionsDB[roundKey].topics[topic] ||
        !questionsDB[roundKey].topics[topic].questions[questionID]
    ) {
        return { error: "Въпросът не е намерен" };
    }
    const correctAnswer = questionsDB[roundKey].topics[topic].questions[questionID].answer.toLowerCase();
    const playerAnswer = answer.toLowerCase();
    const player = game.players.find(p => p.username === username);
    if (!player) {
        return { error: "Потребителят не е намерен в играта" };
    }
    if (playerAnswer === correctAnswer) {
        const scoreToAdd = 10;
        player.score += scoreToAdd;
        return { success: true, correct: true, username, scoreAdded: scoreToAdd, newScore: player.score };
    } else {
        player.eliminated = true;
        return { success: true, correct: false, username, message: "Грешен отговор. Елиминиран/а си за този рунд." };
    }
}

function endGame(io, gameID) {
    const game = games[gameID];
    // Start the players by points (from the greatest to lowest)
    const sortedPlayers = game.players.slice().sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0].username;
    io.to(gameID).emit('gameEnded', { scores: sortedPlayers, winner });
}

module.exports = { prepareNextQuestion, processAnswer, endGame };
