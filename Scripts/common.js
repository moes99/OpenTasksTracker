import { Task } from "./classes.js";
import { timestampFromDate } from "./firestore.js";

export function assignEventListenersToTask(task) {
  //Edit task btn
  task.editTaskBtn = document.getElementById(`editTaskBtn_${task.id}`);
  task.editTaskBtn.addEventListener("click", () => task.editTask());

  //Delete task btn
  task.deleteTaskBtn = document.getElementById(`deleteTaskBtn_${task.id}`);
  task.deleteTaskBtn.addEventListener("click", () => {
    task.deleteTask();
    task = null;
  });

  //Edit scope btn
  task.editScopeBtn = document.getElementById(`editScopeBtn_${task.id}`);
  task.editScopeBtn.addEventListener("click", () => task.updateScope());
  task.taskScope = document.getElementById(`taskScope_${task.id}`);
  task.scopeContainer = document.getElementById(`scopeContainer_${task.id}`);

  //Number and title fields
  const nbTitle = document.getElementById(`number_title_${task.id}`);
  nbTitle?.addEventListener("input", () =>
    task.updateNumberTitle(nbTitle.value.trim()),
  );

  //Scope progress fields
  const fields = document.getElementsByClassName(`input_${task.id}`);
  Array.from(fields).forEach((field) => {
    field.addEventListener("input", () => task.updateScopeProgress(field));
  });

  //Spinner
  task.spinner = document.getElementById(`spinner_${task.id}`);
}

export function insertNoTasksMessage() {
  const tasksContainer = document.getElementById("tasksContainer");
  tasksContainer.insertAdjacentHTML(
    "beforebegin",
    '<h3 class="text-center">There are no tasks available. Enjoy your free time!</h3>',
  );
}
