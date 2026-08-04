import { verifyUser } from "./firestore.js";
import { Admin } from "./classes.js";

const nameInput = document.getElementById("formName");
const passwordInput = document.getElementById("formPassword");
const loginButton = document.getElementById("loginButton");
const rememberMeCheckbox = document.getElementById("rememberMe");
loginButton.addEventListener("click", handleLogin);

async function handleLogin() {
  const name = nameInput.value.trim();
  const password = passwordInput.value.trim();
  const user = await verifyUser(name, password);
  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";
  console.log(user);
  if (user) {
    const currentUser = new Admin(user.id, user.name, user.isSuperAdmin);
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(currentUser));
    }
    window.location.href = "../index.html";
  } else {
    alert("Invalid name or password. Please try again.");
  }
  rememberMeCheckbox.checked = false;
  loginButton.disabled = false;
  loginButton.textContent = "Login";
}
