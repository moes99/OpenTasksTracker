//Imports and exports
import { getCollectionData } from "./firestore.js";
import { Admin } from "./classes.js";

//Checking if the user is logged in
const user = JSON.parse(
  sessionStorage.getItem("user") || localStorage.getItem("user"),
);
if (!user) {
  window.location.href = "Pages/login.html";
}
const currentAdmin = new Admin(user.id, user.name, user.isSuperAdmin);

//Displaying today's date in the heading
const dateHeading = document.getElementById("dateHeading");
const today = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const formattedDate = today.toLocaleDateString(undefined, options);
dateHeading.textContent = `Open Tasks - ${formattedDate}`;

//Adding event listener to buttons
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", showData);

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
