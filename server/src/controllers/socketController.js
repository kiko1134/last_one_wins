const { games, questionsDB } = require('../models/data');
const { prepareNextQuestion, processAnswer, endGame } = require('../services/gameService');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Нов клиент се свърза:', socket.id);

        socket.on('joinGame', (data) => {
            const { gameID, username } = data;
            socket.join(gameID);
            socket.gameID = gameID;
            socket.username = username;

            if (games[gameID]) {
                const game = games[gameID];
                if (game.players.length >= 3 && !game.players.some(p => p.username === username)) {
                    socket.emit('error', { error: "Играта вече е пълна." });
                    return;
                }
                if (!game.players.some(p => p.username === username)) {
                    game.players.push({ username, score: 0, eliminated: false });
                }
            } else {
                socket.emit('error', { error: "Играта не е намерена" });
                return;
            }
            console.log(`${username} се присъедини към игра ${gameID}`);
            io.to(gameID).emit('playerJoined', { username });

            // If there are 3 players in the game - the game can be started
            const game = games[gameID];
            if (game.players.length === 3) {
                // Restarts elimination state for all players
                game.players.forEach(player => player.eliminated = false);
                game.currentRound = 1;
                game.currentTopic = 1;
                game.currentQuestion = 1;
                game.buzzerLockedBy = null;
                const roundKey = `round${game.currentRound}`;
                if (
                    questionsDB[roundKey] &&
                    questionsDB[roundKey].topics[game.currentTopic] &&
                    questionsDB[roundKey].topics[game.currentTopic].questions[game.currentQuestion]
                ) {
                    const questionData = questionsDB[roundKey].topics[game.currentTopic].questions[game.currentQuestion];
                    io.to(gameID).emit('gameStarted', {
                        question: questionData.question,
                        round: game.currentRound,
                        topic: game.currentTopic,
                        questionID: game.currentQuestion,
                        time: 30
                    });
                } else {
                    io.to(gameID).emit('error', { error: "Началният въпрос не е намерен." });
                }
            }
        });

        socket.on('lockAnswer', (data) => {
            const { gameID, username } = data;
            if (!games[gameID]) {
                socket.emit('error', { error: "Играта не е намерена" });
                return;
            }
            const game = games[gameID];
            if (game.buzzerLockedBy) {
                socket.emit('error', { error: "Бутонът вече е заключен." });
                return;
            }
            game.buzzerLockedBy = username;
            io.to(gameID).emit('buzzerLocked', { username });
        });

        socket.on('submitAnswer', (data) => {
            const result = processAnswer(data);
            io.to(data.gameID).emit('answerResult', result);
            if (games[data.gameID]) {
                games[data.gameID].buzzerLockedBy = null;
                io.to(data.gameID).emit('buzzerReset');
                if (result.correct) {
                    let game = games[data.gameID];
                    if (prepareNextQuestion(game)) {
                        const roundKey = `round${game.currentRound}`;
                        const questionData = questionsDB[roundKey].topics[game.currentTopic].questions[game.currentQuestion];
                        io.to(data.gameID).emit('nextQuestion', {
                            question: questionData.question,
                            round: game.currentRound,
                            topic: game.currentTopic,
                            questionID: game.currentQuestion,
                            time: 30
                        });
                    } else {
                        endGame(io, data.gameID);
                    }
                } else {
                    // If the answer is wrong - resume the timer for the current question
                    io.to(data.gameID).emit('resumeTimer');
                }
            }
        });

        socket.on('timeUp', (data) => {
            const { gameID } = data;
            if (!games[gameID]) return;
            let game = games[gameID];
            game.buzzerLockedBy = null;
            if (prepareNextQuestion(game)) {
                const roundKey = `round${game.currentRound}`;
                const questionData = questionsDB[roundKey].topics[game.currentTopic].questions[game.currentQuestion];
                io.to(gameID).emit('nextQuestion', {
                    question: questionData.question,
                    round: game.currentRound,
                    topic: game.currentTopic,
                    questionID: game.currentQuestion,
                    time: 30
                });
            } else {
                endGame(io, gameID);
            }
        });

        socket.on('disconnect', () => {
            console.log('Клиентът се изключи:', socket.id);
            if (socket.gameID && socket.username) {
                io.to(socket.gameID).emit('playerLeft', { username: socket.username });
            }
        });
    });
};
