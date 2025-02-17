// import { getUser, logout } from "./auth.js";
// import { showNotification } from "./ui/notifications.js";
// import { insertGameId } from "./ui/gameUI.js";
// import { API } from "./api.js";
//
// const socket = io();
//
// let currentUser = null;
// let gameID = null;
//
// const logoutButton = document.getElementById("logout");
//
// logoutButton.addEventListener("click", async () => {
//   await logout();
//   window.location.href = "/login";
// });
//
// // "Join Game" button event
// document.getElementById("join-game").addEventListener("click", async () => {
//   try {
//     currentUser = await getUser();
//     if (!currentUser) {
//       alert("Моля, влезте в системата!");
//       return;
//     }
//     const gameCode = document.getElementById("game-code").value.trim();
//     if (!gameCode) {
//       alert("Моля, въведете код на играта за присъединяване.");
//       return;
//     }
//     socket.emit("joinGame", { gameID: gameCode, username: currentUser.username });
//     showNotification("Присъединявате се към играта. Изчаквайте стартирането...");
//     // insertGameId(gameCode);
//     // Save the game code to localStorage so index.html can access it
//     localStorage.setItem("gameCode", gameCode);
//     window.location.href = "/index";
//   } catch (err) {
//     console.error(err);
//     alert("Грешка при присъединяване към играта.");
//   }
// });
//
// // "Create Game" button event
// document.getElementById("create-game").addEventListener("click", async () => {
//   try {
//     currentUser = await getUser();
//     if (!currentUser) {
//       alert("Моля, влезте в системата!");
//       return;
//     }
//     // Call the API to create a new game, sending the current user's username
//     const data = await API.createGame(currentUser.username);
//     if (data.success) {
//       gameID = data.gameID;
//       console.log("Игра създадена с ID:", gameID);
//       socket.emit("joinGame", { gameID: gameID, username: currentUser.username });
//       showNotification("Играта е създадена. Изчаквайте други играчи...");
//       // insertGameId(gameID);
//       // Save the newly created game code for index.html
//       localStorage.setItem("gameCode", gameID);
//       window.location.href = "/index";
//     } else {
//       alert("Грешка при създаване на играта: " + data.error);
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Грешка при свързване със сървъра.");
//   }
// });
//

import { getUser, logout } from "./auth.js";
import { showNotification } from "./ui/notifications.js";
import { insertGameId } from "./ui/gameUI.js";
import { API } from "./api.js";

// Initialize socket
const socket = io();

let currentUser = null;
let gameID = null;

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", async () => {
  await logout();
  window.location.href = "/login";
});

// "Join Game" button event
document.getElementById("join-game").addEventListener("click", async () => {
  try {
    currentUser = await getUser();
    if (!currentUser) {
      alert("Моля, влезте в системата!");
      return;
    }
    const gameCode = document.getElementById("game-code").value.trim();
    if (!gameCode) {
      alert("Моля, въведете код на играта за присъединяване.");
      return;
    }
    socket.emit("joinGame", { gameID: gameCode, username: currentUser.username });
    showNotification("Присъединявате се към играта. Изчаквайте стартирането...");
    // insertGameId(;
    // Redirect to index.html with the gameID in the URL (no creator flag)
    window.location.href = `/index?gameID=${encodeURIComponent(gameCode)}`;
  } catch (err) {
    console.error(err);
    alert("Грешка при присъединяване към играта.");
  }
});

// "Create Game" button event
document.getElementById("create-game").addEventListener("click", async () => {
  try {
    currentUser = await getUser();
    if (!currentUser) {
      alert("Моля, влезте в системата!");
      return;
    }
    console.log('CUR USER:',currentUser);
    const data = await API.createGame(currentUser);
    if (data.success) {
      gameID = data.gameID;
      console.log("Игра създадена с ID:", gameID);
      socket.emit("joinGame", { gameID: gameID, user: currentUser });
      showNotification("Играта е създадена. Изчаквайте други играчи...");
      // Redirect to index.html with the gameID and a creator flag
      window.location.href = `/index?gameID=${encodeURIComponent(gameID)}&creator=1`;
    } else {
      alert("Грешка при създаване на играта: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Грешка при свързване със сървъра.");
  }
});

