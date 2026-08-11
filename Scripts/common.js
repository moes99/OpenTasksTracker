import { Task } from "./classes.js";
import { timestampFromDate } from "./firestore.js";

export function assignEventListenersToTask(task) {
  //Edit task btn
  const editTaskbtn = document.getElementById(`editTaskBtn_${task.id}`);
  editTaskbtn?.addEventListener("click", () => task.editTask(editTaskbtn));

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

export function createEmptyTask() {
  return new Task(
    "",
    "",
    "",
    "M E P",
    {
      M: { assignedTo: "", isCompleted: false, situation: "" },
      P: { assignedTo: "", isCompleted: false, situation: "" },
      E: { assignedTo: "", isCompleted: false, situation: "" },
    },
    timestampFromDate(new Date()),
    false,
    "",
  );
}
