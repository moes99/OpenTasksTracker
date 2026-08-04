//Imports and exports
import { getCollectionData } from "./firestore.js";
import { Admin } from "./classes.js";

//Checking if the user is logged in
const user = JSON.parse(sessionStorage.getItem("user"));
if (!user) {
  window.location.href = "Pages/login.html";
}
const currentAdmin = new Admin(
  user.id,
  user.name,
  user.email,
  user.isSuperAdmin,
);

//Displaying today's date in the heading
const dateHeading = document.getElementById("dateHeading");
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;
dateHeading.textContent += ` ${formattedDate}`;

//Displaying the current user in the navbar
const currentUserElement = document.getElementById("currentUser");
currentUserElement.textContent = currentAdmin.name;

//Populating the task list with data from Firestore
async function showData() {
  try {
    console.log("Fetching data from Firestore...");
    taskList.innerHTML = "<p>Loading...</p>";
    const data = await getCollectionData("admins");
    console.log("Fetched Firestore documents:", data);
    taskList.innerHTML = data
      .map(
        (task) => `<div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Name: ${task.name}</h5>
            <p class="card-text">Email: ${task.email}</p>
            <p class="card-text">Is Super Admin: ${task.isSuperAdmin}</p>
          </div>
        </div>`,
      )
      .join("");
  } catch (error) {
    console.error("Failed to fetch Firestore data:", error);
    taskList.innerHTML =
      "<p>Could not load data. Check your Firestore connection.</p>";
  }
}
