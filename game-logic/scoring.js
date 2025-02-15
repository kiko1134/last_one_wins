function processAnswer(game, questionsDB, data) {
    const { username, answer, round, topic, questionID } = data;
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

function endGame(io, game) {
    const sortedPlayers = game.players.slice().sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0].username;
    io.to(game.gameID).emit('gameEnded', { scores: sortedPlayers, winner });
}

module.exports = { processAnswer, endGame };
