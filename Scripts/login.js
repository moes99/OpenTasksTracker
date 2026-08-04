import { verifyUser } from "./firestore.js";
import { Admin } from "./classes.js";

const emailInput = document.getElementById("formEmail");
const passwordInput = document.getElementById("formPassword");
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", handleLogin);

async function handleLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";
  try {
    const user = await verifyUser(email, password);
    if (user) {
      const currentUser = new Admin(
        user.id,
        user.name,
        user.email,
        user.isSuperAdmin,
      );
      sessionStorage.setItem("user", JSON.stringify(currentUser));
      window.location.href = "../index.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login. Please try again later.");
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
}
