import { API } from "./api.js";
import * as timer from "/game-logic/timer.mjs";
import {
  showNotification,
  displayScoreboard,
  closeScoreboardModal,
} from "./ui/notifications.js";
import {
  updateQuestionText,
  resetAnswerInput,
  disableAnswering,
  enableBuzzer,
  enableAnswering,
  insertGameId,
  showQuestionsModal
} from "./ui/gameUI.js";
import { getUser } from "./auth.js";

const { Timer } = timer;

const socket = io();

// // Global state
let gameID = null;
let currentRound = 1;
let currentTopic = 1;
let currentQuestionID = 1;
let isEliminated = false;

const timerElement = document.getElementById("timer");
const gameTimer = new Timer(timerElement, 30, onTimeUp);
let currentUser = null;

// const inputGameID = null;

// Socket.IO events handlers

socket.on("connect", async () => {
  console.log("Свързан сте към сървъра на играта.");
  currentUser = await getUser();
  console.log("Текущ потребител:", currentUser);
  if (!currentUser) {
    console.error("Не сте влезли в системата!");
    throw new Error("Не сте влезли в системата!");
  }
});

socket.on("gameStarted", (data) => {
  showQuestionsModal();
  currentRound = data.round;
  currentTopic = data.topic;
  currentQuestionID = data.questionID;
  updateQuestionText(data.question);
  isEliminated = false;
  enableBuzzer();
  gameTimer.reset(data.time || 30, onTimeUp);
  resetAnswerInput();
  showNotification("Играта започна!");
});

socket.on("buzzerLocked", (data) => {
  gameTimer.stop();
  if (data.username !== currentUser.username) {
    disableAnswering();
    showNotification(`Играчът ${data.username} заключи отговора.`);
  } else {
    enableAnswering();
    showNotification("Вие заключихте отговора. Въведете отговора си.");
  }
});

socket.on("resumeTimer", () => {
  gameTimer.resume();
  if (!isEliminated) {
    document.getElementById("buzzer-button").disabled = false;
  }
  showNotification("Таймерът е възобновен за текущия въпрос.");
});

socket.on("nextQuestion", (data) => {
  currentRound = data.round;
  currentTopic = data.topic;
  currentQuestionID = data.questionID;
  updateQuestionText(data.question);
  isEliminated = false;
  gameTimer.reset(data.time || 30, onTimeUp);
  enableBuzzer();
  resetAnswerInput();
  showNotification("Ново питане!");
});

socket.on("answerResult", (data) => {
  console.log("Резултат от отговора:", data);
  if (data.success) {
    if (data.correct) {
      showNotification(`${data.username} отговори правилно!`);
    } else {
      showNotification(
        `${data.username} отговори грешно и е елиминиран за този рунд!`
      );
      if (data.username === currentUser.username) {
        isEliminated = true;
        disableAnswering();
      }
    }
  }
});

socket.on("gameEnded", (data) => {
  displayScoreboard(data.scores, data.winner);
});

socket.on("playerJoined", (data) => {
  showNotification(`${data.username} се присъедини към играта.`);
});

socket.on("playerLeft", (data) => {
  showNotification(`${data.username} напусна играта.`);
});

// Callback, called when the time is up
function onTimeUp() {
  socket.emit("timeUp", { gameID });
}

// Click handlers from the UI

document.getElementById("buzzer-button").addEventListener("click", () => {
  socket.emit("lockAnswer", { gameID, username: currentUser.username });
});

document.getElementById("submit-answer").addEventListener("click", () => {
  const answer = document.getElementById("answer-input").value;
  socket.emit("submitAnswer", {
    gameID,
    username: currentUser.username,
    answer: answer,
    round: currentRound,
    topic: currentTopic,
    questionID: currentQuestionID,
  });
});

document.querySelector(".close").addEventListener("click", () => {
  closeScoreboardModal();
});
window.addEventListener("click", (event) => {
  const scoreboardModal = document.getElementById("scoreboard-modal");
  if (event.target === scoreboardModal) {
    closeScoreboardModal();
  }
});

// Start or join game
// if (inputGameID?.trim()) {
//   gameID = inputGameID.trim();
//   socket.emit("joinGame", { gameID, username: currentUser.username });
//   showNotification("Присъединявате се към играта. Изчаквайте стартирането...");
//   insertGameId(gameID);
// } else {
//   API.createGame(currentUser.username)
//     .then((data) => {
//       if (data.success) {
//         gameID = data.gameID;
//         console.log("Игра създадена с ID:", gameID);
//         socket.emit("joinGame", { gameID, username: currentUser.username });
//         showNotification("Играта е създадена. Изчаквайте други играчи...");
//         insertGameId(gameID);
//       } else {
//         console.error("Грешка при създаване на игра:", data.error);
//       }
//     })
//     .catch((err) => console.error(err));
// }



