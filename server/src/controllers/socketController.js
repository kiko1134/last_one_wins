import {games} from '../models/data.js';
import {endGameService, prepareNextQuestionService, processAnswerService} from '../services/gameService.js';
import {getRandomQuestions} from "../services/questionService.js";

export default (io) => {
    io.on('connection', (socket) => {
        console.log('Нов клиент се свърза:', socket.id);

        socket.on('joinGame', async (data) => {
            const {gameID, username} = data;

            if (!games[gameID]) {
                socket.emit('error', {error: "Играта не е намерена"});
                return;
            }

            const game = games[gameID];

            socket.join(gameID);
            socket.gameID = gameID;
            socket.username = username;

            console.log("Game players", game.players);

            if (!game.questions) {
                try {
                    const randomQuestions = await getRandomQuestions(1);
                    game.questions = randomQuestions;
                    console.log(`Заредени въпроси за игра ${gameID}:`, randomQuestions);
                } catch (err) {
                    console.error("Грешка при зареждане на въпроси:", err);
                    socket.emit('error', {error: "Грешка при зареждане на въпроси"});
                    return;
                }
            }

            if (game.players.length >= 3 && !game.players.some(p => p.username === username)) {
                socket.emit('error', {error: "Играта вече е пълна."});
                return;
            }
            if (!game.players.some(p => p.username === username)) {
                game.players.push({username, score: 0, eliminated: false});
            }
            console.log(`${username} се присъедини към игра ${gameID}`);
            io.to(gameID).emit('playerJoined', {username});

            if (game.players.length === 3) {
                game.players.forEach(player => player.eliminated = false);
                game.currentRound = 1;
                game.currentTopic = 1;
                game.currentQuestion = 0; // индексът започва от 0
                game.buzzerLockedBy = null;
                if (game.questions && game.questions.length > 0) {
                    const questionData = game.questions[game.currentQuestion];
                    io.to(gameID).emit('gameStarted', {
                        question: questionData.title,
                        round: game.currentRound,
                        topic: game.currentTopic,
                        questionID: questionData.id,
                        time: 30
                    });
                } else {
                    io.to(gameID).emit('error', {error: "Началният въпрос не е намерен."});
                }
            }
        });

        socket.on('lockAnswer', (data) => {
            const {gameID, username} = data;
            if (!games[gameID]) {
                socket.emit('error', {error: "Играта не е намерена"});
                return;
            }
            const game = games[gameID];
            if (game.buzzerLockedBy) {
                socket.emit('error', {error: "Бутонът вече е заключен."});
                return;
            }
            game.buzzerLockedBy = username;
            io.to(gameID).emit('buzzerLocked', {username});
        });

        socket.on('submitAnswer', (data) => {
            const result = processAnswerService(data);
            io.to(data.gameID).emit('answerResult', result);
            if (games[data.gameID]) {
                games[data.gameID].buzzerLockedBy = null;
                io.to(data.gameID).emit('buzzerReset');
                if (result.correct) {
                    let game = games[data.gameID];
                    if (prepareNextQuestionService(game)) {
                        const questionData = game.questions[game.currentQuestion];
                        io.to(data.gameID).emit('nextQuestion', {
                            question: questionData.title,
                            round: game.currentRound,
                            topic: game.currentTopic,
                            questionID: game.currentQuestion,
                            time: 30
                        });
                    } else {
                        endGameService(io, data.gameID);
                    }
                } else {
                    // Ако отговорът е грешен, таймерът се възобновява
                    io.to(data.gameID).emit('resumeTimer');
                }
            }
        });

        socket.on('timeUp', (data) => {
            const {gameID} = data;
            if (!games[gameID]) return;
            let game = games[gameID];
            game.buzzerLockedBy = null;
            if (prepareNextQuestionService(game)) {
                const roundKey = `round${game.currentRound}`;
                const questionData = game.questions[game.currentQuestion];
                io.to(gameID).emit('nextQuestion', {
                    question: questionData.title,
                    round: game.currentRound,
                    topic: game.currentTopic,
                    questionID: game.currentQuestion,
                    time: 30
                });
            } else {
                endGameService(io, gameID);
            }
        });

        socket.on('disconnect', () => {
            console.log('Клиентът се изключи:', socket.id);
            if (socket.gameID && socket.username) {
                io.to(socket.gameID).emit('playerLeft', {username: socket.username});
            }
        });
    });
};
