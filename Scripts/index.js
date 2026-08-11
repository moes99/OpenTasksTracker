//Imports and exports
import { getCollectionData } from "./firestore.js";
import { Admin, Task } from "./classes.js";
import { assignEventListenersToTask } from "./common.js";

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
  user.role,
);
// Make currentAdmin available globally to modules/pages that cannot import index.js
window.currentAdmin = currentAdmin;
export { currentAdmin };

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
const tasksContainer = document.getElementById("tasksContainer");
const spinners = document.getElementById("spinners");
const tasksArray = [];
window.onload = async () => {
  const tasks = await getCollectionData("tasks");
  tasks.forEach((task) => {
    const newTask = new Task(
      task.id,
      task.title,
      task.number,
      task.scope,
      task.scopeProgress,
      task.dateCreated,
      task.isLocked,
      task.isLockedBy,
    );
    tasksArray.push(newTask);
  });

  //Building ui
  tasksContainer.innerHTML = tasksArray
    .map((task) => task.buildTaskCard())
    .join("");

  spinners.remove();
  //Adding event listeners
  tasksArray.forEach((task) => {
    assignEventListenersToTask(task);
  });
};
