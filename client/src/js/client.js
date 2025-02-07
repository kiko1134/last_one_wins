// Свързваме се към Socket.IO сървъра
const socket = io();

// Глобални променливи
let gameID = null;
let currentRound = 1;
let currentTopic = 1;
let currentQuestionID = 1;
let isEliminated = false;

// Променливи за таймера
let timerInterval = null;
let remainingTime = 0;

let myUsername = prompt("Въведете вашето потребителско име:");
while (!myUsername || myUsername.trim() === "") {
    myUsername = prompt("Моля, въведете валидно потребителско име (не може да е празно):");
}
const inputGameID = prompt("Въведете id на игра (ако имате), или оставете празно за нова игра:");

// DOM елементи
const timerElement = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitAnswerButton = document.getElementById('submit-answer');
const buzzerButton = document.getElementById('buzzer-button');
const notificationEl = document.getElementById('notification');
const scoreboardModal = document.getElementById('scoreboard-modal');
const scoreboardContent = document.getElementById('scoreboard-content');
const modalClose = document.querySelector('.close');

// Функция за изпълнение на таймера
function runTimer() {
    timerInterval = setInterval(() => {
        remainingTime--;
        timerElement.textContent = remainingTime;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            disableAnswering();
            notifyTimeUp();
        }
    }, 1000);
}

// Стартиране на таймера от зададено време
function startTimer(duration) {
    remainingTime = duration;
    timerElement.textContent = remainingTime;
    runTimer();
}

// Паузиране на таймера
function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Възобновяване на таймера от оставащото време
function resumeTimer() {
    if (!timerInterval && remainingTime > 0) {
        runTimer();
    }
}

// Деактивиране на възможността за отговор
function disableAnswering() {
    buzzerButton.disabled = true;
    submitAnswerButton.disabled = true;
    answerInput.disabled = true;
}

// Активиране на бутона за заключване (за нов въпрос винаги нулираме state-а)
function enableBuzzer() {
    isEliminated = false;
    buzzerButton.disabled = false;
    answerInput.disabled = true;
    submitAnswerButton.disabled = true;
}

// Известяване към сървъра, че времето е свършило
function notifyTimeUp() {
    socket.emit('timeUp', {gameID});
}

// Зареждане на въпрос (чрез HTTP заявка)
function loadQuestion() {
    fetch(`/game/questions/round/${currentRound}/topic/${currentTopic}/questions/${currentQuestionID}`)
        .then(res => res.json())
        .then(data => {
            questionText.textContent = data.question;
            isEliminated = false;
            enableBuzzer();
            startTimer(30);
            answerInput.value = ""; // Изчистваме input полето
        })
        .catch(err => console.error(err));
}

// Функция за показване на съобщения/нотификации
function showNotification(message) {
    notificationEl.textContent = message;
    setTimeout(() => {
        notificationEl.textContent = '';
    }, 3000);
}

// --- Обработка на събития, свързани с бутона за заключване (buzzer) ---
buzzerButton.addEventListener('click', () => {
    socket.emit('lockAnswer', {gameID, username: myUsername});
});

submitAnswerButton.addEventListener('click', () => {
    socket.emit('submitAnswer', {
        gameID,
        username: myUsername,
        answer: answerInput.value,
        round: currentRound,
        topic: currentTopic,
        questionID: currentQuestionID
    });
});

// При получаване на "buzzerLocked" – таймерът се паузира
socket.on('buzzerLocked', data => {
    pauseTimer();
    const lockingUser = data.username;
    if (lockingUser !== myUsername) {
        buzzerButton.disabled = true;
        showNotification(`Играчът ${lockingUser} заключи отговора.`);
    } else {
        buzzerButton.disabled = true;
        answerInput.disabled = false;
        submitAnswerButton.disabled = false;
        showNotification("Вие заключихте отговора. Въведете отговора си.");
    }
});

// При получаване на "resumeTimer" – таймерът се възобновява и оставащите играчи могат да заключват
socket.on('resumeTimer', () => {
    resumeTimer();
    if (!isEliminated) {
        buzzerButton.disabled = false;
    }
    showNotification("Таймерът е възобновен за текущия въпрос.");
});

// При получаване на "nextQuestion" – обновяваме въпроса, рестартираме таймера, изчистваме input полето и нулираме state-а
socket.on('nextQuestion', data => {
    currentRound = data.round;
    currentTopic = data.topic;
    currentQuestionID = data.questionID;
    questionText.textContent = data.question;
    isEliminated = false;
    startTimer(data.time || 30);
    enableBuzzer();
    answerInput.value = ""; // Изчистваме input полето
    showNotification("Ново питане!");
});

// Обработка на резултата от отговора
socket.on('answerResult', data => {
    console.log('Резултат от отговора:', data);
    if (data.success) {
        if (data.correct) {
            showNotification(`${data.username} отговори правилно!`);
        } else {
            showNotification(`${data.username} отговори грешно и е елиминиран за този рунд!`);
            if (data.username === myUsername) {
                isEliminated = true;
                disableAnswering();
            }
        }
    }
});

// При получаване на "gameEnded" – показваме финалния резултат (подреден като на подиум)
socket.on('gameEnded', data => {
    displayScoreboard(data.scores, data.winner);
});
socket.on('playerJoined', data => {
    showNotification(`${data.username} се присъедини към играта.`);
});
socket.on('playerLeft', data => {
    showNotification(`${data.username} напусна играта.`);
});

function displayScoreboard(scores, winner) {
    let html = `<h3>Победител: ${winner}</h3><ul>`;
    scores.forEach(player => {
        html += `<li>${player.username}: ${player.score} точки</li>`;
    });
    html += `</ul>`;
    scoreboardContent.innerHTML = html;
    scoreboardModal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
    scoreboardModal.style.display = 'none';
});
window.addEventListener('click', event => {
    if (event.target === scoreboardModal) {
        scoreboardModal.style.display = 'none';
    }
});

// Стартиране на играта – присъединяване или създаване на нова игра
if (inputGameID && inputGameID.trim() !== "") {
    gameID = inputGameID.trim();
    socket.emit('joinGame', {gameID, username: myUsername});
    showNotification("Присъединявате се към играта. Изчаквайте стартирането...");
} else {
    fetch('/game/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({players: [{username: myUsername}]})
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                gameID = data.gameID;
                console.log("Игра създадена с ID:", gameID);
                socket.emit('joinGame', {gameID, username: myUsername});
                showNotification("Играта е създадена. Изчаквайте други играчи...");
            } else {
                console.error("Грешка при създаване на игра:", data.error);
            }
        })
        .catch(err => console.error(err));
}

// При получаване на "gameStarted" – започваме играта, нулираме input полето и активираме бутона
socket.on('gameStarted', data => {
    currentRound = data.round;
    currentTopic = data.topic;
    currentQuestionID = data.questionID;
    questionText.textContent = data.question;
    isEliminated = false;
    enableBuzzer();
    startTimer(data.time || 30);
    answerInput.value = ""; // Изчистваме input полето
    showNotification("Играта започна!");
});
