import { register } from "./auth.js";
import { showNotification } from "./ui/notifications.js";


const submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!email || !password || !username) {
    showNotification("Моля, попълнете всички полета!");
    return;
  }

  try {
    const response = await register(email, username, password);
    console.log("response: ", response);
    if (response.status === 201) {
      showNotification("Успешно създаване на акаунт!");
      window.location.href = "/game";
    } else showNotification(response.message);
  } catch (err) {
    showNotification(err.message);
    console.error(err);
  }
});
