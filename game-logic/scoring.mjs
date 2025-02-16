export const processAnswer = (game, data) => {
    const { username, answer } = data;

    // Проверка дали въпросите са заредени
    if (!game.questions || game.questions.length === 0) {
        return { error: "Въпросите не са заредени" };
    }

    // Взимаме текущия въпрос според индекса game.currentQuestion
    const currentQuestion = game.questions[game.currentQuestion];
    if (!currentQuestion) {
        return { error: "Въпросът не е намерен" };
    }

    const correctAnswer = currentQuestion.answer.toLowerCase();
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

export const endGame = (io, game) => {
    const sortedPlayers = game.players.slice().sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0].username;
    io.to(game.gameID).emit('gameEnded', { scores: sortedPlayers, winner });
}
