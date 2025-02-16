import { showNotification } from "./notifications.js";

export function updateQuestionText(text) {
  const questionTextEl = document.getElementById("question-text");
  questionTextEl.textContent = text;
}

export function resetAnswerInput() {
  const answerInput = document.getElementById("answer-input");
  answerInput.value = "";
}

export function disableAnswering() {
  document.getElementById("buzzer-button").disabled = true;
  document.getElementById("submit-answer").disabled = true;
  document.getElementById("answer-input").disabled = true;
}

export function enableBuzzer() {
  document.getElementById("buzzer-button").disabled = false;
  document.getElementById("answer-input").disabled = true;
  document.getElementById("submit-answer").disabled = true;
}

export function enableAnswering() {
  document.getElementById("buzzer-button").disabled = true;
  document.getElementById("answer-input").disabled = false;
  document.getElementById("submit-answer").disabled = false;
}

export const insertGameId = (gameID) => {
  document.getElementById("code").innerText = gameID;
  document.getElementById("copy-to-clipboard").addEventListener("click", () => {
    navigator.clipboard.writeText(gameID);
    showNotification("Кодът е копиран!");
  });
};

export const showQuestionsModal = () => {
  document.getElementById("code-container").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
};
