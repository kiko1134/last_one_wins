import { createGame } from "./api.js";
import { logout } from "./auth.js";

// const createGameButton = document.getElementById('create-game');

// createGameButton.addEventListener('click', async () => {
//     try {
//         const response = await createGame();

//     }

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", async () => {
  await logout();
  window.location.href = "/login";
});
