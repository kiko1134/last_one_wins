const express = require('express');
const http = require('http');
const socketIo = require('socket.io'); // Импортиране на Socket.IO
const bodyParser = require('body-parser');
const { join } = require("node:path");
const app = express();
const PORT = process.env.PORT || 3000;

// Създаваме HTTP сървър, върху който ще работи Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../../client/src')));
app.use(express.urlencoded({ extended: true }));

app.set('views', join(__dirname, '../../client/src/views'));
app.set('view engine', 'ejs');

// In-memory хранилища за игри, потребители и въпроси
let games = {};
let users = {};

// Примерна база от въпроси, организирана по рундове и сфери (topics)
let questionsDB = {
    round1: {
        topics: {
            1: { // История
                topicName: "История",
                questions: {
                    1: { question: "Кога е започнала Втората световна война?", answer: "1939" },
                    2: { question: "Кой е първият президент на САЩ?", answer: "Вашингтон" }
                }
            },
            2: { // Наука
                topicName: "Наука",
                questions: {
                    1: { question: "Какъв е химичният символ на вода?", answer: "H2O" },
                    2: { question: "Кой е открил гравитацията?", answer: "Нютон" }
                }
            }
        }
    },
    round2: {
        topics: {
            1: { // Литература
                topicName: "Литература",
                questions: {
                    1: { question: "Кой е авторът на 'Под игото'?", answer: "Иван Вазов" },
                    2: { question: "Кой е написал '1984'?", answer: "Оруел" }
                }
            },
            2: { // Спорт
                topicName: "Спорт",
                questions: {
                    1: { question: "Знаеш ли кой още оправя коли?", answer: "майка ти" },
                    2: { question: "Кой е носител на най-много олимпийски златни медали?", answer: "Юсейн Болт" }
                }
            }
        }
    }
};

// функция за генериране на уникален gameID
function generateGameID() {
    return Math.random().toString(36).substr(2, 9);
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', (req, res) => {
    const { username } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: "Потребителят вече съществува" });
    }
    users[username] = { username, score: 0 };
    res.json({ success: true, username });
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!users[username]) {
        users[username] = { username, score: 0 };
    }
    res.json({ success: true, username });
});

app.post('/game/create', (req, res) => {
    const { players } = req.body; // Очакваме масив от обекти: [{ username: "Играч1" }, ...]
    if (!players || players.length < 1) {
        return res.status(400).json({ error: "Необходими са поне 1 играч" });
    }
    const gameID = generateGameID();
    games[gameID] = {
        gameID,
        players: players.map(p => ({ username: p.username, score: 0, eliminated: false })),
        currentRound: 1,
        currentTopic: 1,  // Начален topic
        currentQuestion: null,
        currentTurn: 0,
        buzzerLockedBy: null // проследява кой е заключил отговора за текущия въпрос
    };
    res.json({ success: true, gameID });
});

// Функция за подготовка на следващ въпрос (или преминаване към следващ рунд)
function prepareNextQuestion(game) {
    const currentRoundKey = `round${game.currentRound}`;
    // Проверка за следващ въпрос в текущия topic
    if (
        questionsDB[currentRoundKey] &&
        questionsDB[currentRoundKey].topics[game.currentTopic] &&
        questionsDB[currentRoundKey].topics[game.currentTopic].questions[game.currentQuestion + 1]
    ) {
        game.currentQuestion++;
    }
    // Ако няма следващ въпрос в текущия topic, проверяваме за следващ topic в текущия рунд
    else if (
        questionsDB[currentRoundKey] &&
        questionsDB[currentRoundKey].topics[game.currentTopic + 1]
    ) {
        game.currentTopic++;
        game.currentQuestion = 1;
    }
    // Ако няма следващи въпроси в текущия рунд, проверяваме за следващ рунд
    else if (questionsDB[`round${game.currentRound + 1}`]) {
        game.currentRound++;
        game.currentTopic = 1;
        game.currentQuestion = 1;
    } else {
        // Няма повече въпроси – играта приключва
        return false;
    }
    // Рестартираме elimination state за всички играчи за новия въпрос
    game.players.forEach(player => player.eliminated = false);
    return true;
}

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

        // Ако в играта са 3 играчи, стартираме играта
        const game = games[gameID];
        if (game.players.length === 3) {
            // Рестартираме elimination state за всички играчи
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

    // Когато играч заключи отговора
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

    // При подаване на отговор
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
                    // Няма повече въпроси – играта приключва. Изчисляваме финалните резултати.
                    endGame(data.gameID);
                }
            } else {
                // Ако отговорът е грешен – възобновяваме таймера за текущия въпрос
                io.to(data.gameID).emit('resumeTimer');
            }
        }
    });

    // При изтичане на времето – обработваме като грешен отговор
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
            endGame(gameID);
        }
    });

    socket.on('disconnect', () => {
        console.log('Клиентът се изключи:', socket.id);
        if (socket.gameID && socket.username) {
            io.to(socket.gameID).emit('playerLeft', { username: socket.username });
        }
    });
});

// Функция за обработка на отговор
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

// Функция за край на играта – изчислява финалните резултати, сортира ги и ги изпраща на клиентите
function endGame(gameID) {
    const game = games[gameID];
    // Сортиране на играчите по точки (от най-високи към най-ниски)
    const sortedPlayers = game.players.slice().sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0].username;
    io.to(gameID).emit('gameEnded', { scores: sortedPlayers, winner });
}

server.listen(PORT, () => {
    console.log(`Сървърът работи на порт ${PORT}`);
});
