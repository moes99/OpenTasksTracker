//Imports and exports
import { getCollectionData, createDoc } from "./firestore.js";
import { Admin, Task } from "./classes.js";
import { assignEventListenersToTask, insertNoTasksMessage } from "./common.js";

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

//Getting all containers and their buttons
const tasksContainer = document.getElementById("tasksContainer");
const tasksLink = document.getElementById("tasksLink");
const referencesContainer = document.getElementById("referencesContainer");
const referencesLink = document.getElementById("referencesLink");
const servicesContainer = document.getElementById("servicesContainer");
const servicesLink = document.getElementById("servicesLink");
const appsContainer = document.getElementById("appsContainer");
const appsLink = document.getElementById("appsLink");
var selectedContainer = tasksContainer;
var selectedLink = tasksLink;

//Displaying the selected container
function displayContainer(container, link) {
  selectedContainer.classList.toggle("d-none");
  selectedContainer = container;
  selectedContainer.classList.toggle("d-none");

  selectedLink.classList.toggle("active");
  selectedLink = link;
  selectedLink.classList.toggle("active");
}
tasksLink.addEventListener("click", () =>
  displayContainer(tasksContainer, tasksLink),
);
referencesLink.addEventListener("click", () =>
  displayContainer(referencesContainer, referencesLink),
);
servicesLink.addEventListener("click", () =>
  displayContainer(servicesContainer, servicesLink),
);
appsLink.addEventListener("click", () =>
  displayContainer(appsContainer, appsLink),
);

//Adding event listener to add task button
const addTaskBtn = document.getElementById("addTaskBtn");
addTaskBtn.addEventListener("click", () => {
  Task.addTask();
});

//Populating the task list with data from Firestore
const spinners = document.getElementById("spinners");
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
  });

  //Building ui
  if (Task.instances.length > 0) {
    tasksContainer.innerHTML = Task.instances
      .map((task) => task.buildTaskCard())
      .join("");
  } else insertNoTasksMessage();

  spinners.remove();

  //Adding event listeners
  Task.instances.forEach((task) => {
    assignEventListenersToTask(task);
  });
};

//Waiting for iframe to finish loading
const referencesIFrame = document.getElementById("referencesIFrame");
const iframeSpinner = document.getElementById("iframeSpinner");
referencesIFrame.addEventListener("load", () => {
  iframeSpinner.remove();
  referencesIFrame.classList.remove("offscreen");
});
