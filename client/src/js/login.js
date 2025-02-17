import { login } from "./auth.js";
import { showNotification } from "./ui/notifications.js";

console.log("login.js");

const submitButton = document.getElementById("submit-button");
console.log("submitButton: ", submitButton);

submitButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showNotification("Моля, попълнете всички полета!");
    return;
  }

  try {
    const response = await login(email, password);
    // console.log("response: ", response);
    if (response.status === 200) {
      window.location.href = "/game";
      showNotification("Успешен вход!")
    } else showNotification(response.statusText);
  } catch (err) {
    showNotification(err.message);
    console.error(err);
  }
});
