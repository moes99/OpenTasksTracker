import { insertNoTasksMessage } from "./common.js";
import {
  updateCollectionData,
  getFieldValue,
  createDoc,
  deleteDocument,
  timestampFromDate,
} from "./firestore.js";

export class Admin {
  constructor(id, name, email, isSuperAdmin, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isSuperAdmin = isSuperAdmin;
    this.role = role;
  }
}

export class Task {
  static instances = [];

  constructor(
    id,
    title,
    number,
    scope,
    scopeProgress,
    dateCreated,
    isLocked,
    isLockedBy,
  ) {
    this.id = id;
    this.title = title;
    this.number = number;
    this.scope = scope;
    this.scopeProgress = scopeProgress;
    this.dateCreated = dateCreated.toDate();
    this.isLocked = isLocked;
    this.isLockedBy = isLockedBy;
    this.spinner = null;
    this.editTaskBtn = null;
    this.deleteTaskBtn = null;
    this.editScopeBtn = null;
    this.taskScope = null;
    this.scopeContainer = null;
    Task.instances.push(this);
  }

  static async addTask() {
    try {
      await createDoc("tasks", this.createEmptyTask());
      window.location.reload();
    } catch (error) {
      alert("Error creating new task!");
      console.log(error);
    }
  }

  static createEmptyTask() {
    return {
      title: "New Task",
      number: "x.x.x",
      scope: "M E P",
      scopeProgress: {
        M: { assignedTo: "", isCompleted: false, situation: "" },
        E: { assignedTo: "", isCompleted: false, situation: "" },
        P: { assignedTo: "", isCompleted: false, situation: "" },
      },
      dateCreated: timestampFromDate(new Date()),
      isLocked: false,
      isLockedBy: "",
    };
  }

  async editTask() {
    const isEditRequest = this.editTaskBtn.innerHTML.includes("bi-pencil");

    if (isEditRequest) {
      if (this.isLocked && this.isLockedBy === currentAdmin.name) {
        this.editTaskBtn.innerHTML = '<i class="bi bi-floppy"></i>';
        this.editTaskBtn.title = "Save Changes";
        this.toggleInputFields();
        return;
      }

      const [isLocked, isLockedBy] = await this.checkIfLocked();

      if (isLocked) {
        if (isLockedBy === currentAdmin.name) {
          this.isLocked = true;
          this.isLockedBy = isLockedBy;
          this.editTaskBtn.innerHTML = '<i class="bi bi-floppy"></i>';
          this.editTaskBtn.title = "Save Changes";
          this.toggleInputFields();
        } else {
          alert(
            `This task has been locked by ${isLockedBy}.
            \nPlease ask him/her to save his/her modifications if you need to edit it.
            \nPage will reload to fetch new information.`,
          );
          window.location.reload();
        }
      } else {
        this.toggleSpinner();
        await this.acquireLock();
        this.editTaskBtn.innerHTML = '<i class="bi bi-floppy"></i>';
        this.editTaskBtn.title = "Save Changes";
        this.toggleInputFields();
        this.toggleSpinner();
      }
    } else {
      if (!this.isLocked || this.isLockedBy !== currentAdmin.name) {
        alert(
          "Cannot save changes: you do not currently own the lock for this task.",
        );
        return;
      }
      this.toggleInputFields();
      this.toggleSpinner();
      await this.updateTask();
      await this.releaseLock();
      this.editTaskBtn.innerHTML = '<i class="bi bi-pencil"></i>';
      this.editTaskBtn.title = "Edit Task";
      this.toggleSpinner();
    }
  }

  async checkIfLocked() {
    try {
      const result = await getFieldValue(
        "tasks",
        this.id,
        "isLocked",
        "isLockedBy",
      );

      return result ?? [false, ""];
    } catch (error) {
      alert("Error checking if task is locked!");
      console.log(error);
      return [false, ""];
    }
  }

  async acquireLock() {
    try {
      // Determine admin name without importing index.js to avoid circular import
      const adminName =
        (window.currentAdmin && window.currentAdmin.name) ||
        (sessionStorage.getItem("user")
          ? JSON.parse(sessionStorage.getItem("user")).name
          : "");

      //First try to acquire lock
      await updateCollectionData("tasks", this.id, {
        isLocked: true,
        isLockedBy: adminName,
      });
      //If successful, update task attributes
      this.isLocked = true;
      this.isLockedBy = adminName;
      //Update isLockedBy html element
      const isLockedBy = document.getElementById(`isLockedBy_${this.id}`);
      if (isLockedBy) isLockedBy.innerHTML = `Locked By: ${this.isLockedBy}`;
    } catch (error) {
      alert("Error acquiring lock!");
    }
  }

  async releaseLock() {
    try {
      //First try to release lock
      await updateCollectionData("tasks", this.id, {
        isLocked: false,
        isLockedBy: "",
      });
      //If successful, update task attributes
      this.isLocked = false;
      this.isLockedBy = "";
      //Update isLockedBy html element
      const isLockedBy = document.getElementById(`isLockedBy_${this.id}`);
      isLockedBy.innerHTML = `Locked By: ${this.isLockedBy}`;
    } catch (error) {
      alert("Error releasing lock!");
    }
  }

  toggleInputFields() {
    //Toggling the field containing the number and title
    const nbTitle = document.getElementById(`number_title_${this.id}`);
    if (nbTitle) nbTitle.disabled = !nbTitle.disabled;

    //Toggling the fields related to scope progress
    const scopeArray = this.scope.split(" ");
    scopeArray.forEach((scope) => {
      const assignedTo = document.getElementById(
        `${scope}_assignedTo_${this.id}`,
      );
      const isCompleted = document.getElementById(
        `${scope}_isCompleted_${this.id}`,
      );
      const situation = document.getElementById(
        `${scope}_situation_${this.id}`,
      );
      if (assignedTo) assignedTo.disabled = !assignedTo.disabled;
      if (isCompleted) isCompleted.disabled = !isCompleted.disabled;
      if (situation) situation.disabled = !situation.disabled;
    });
  }

  toggleSpinner() {
    this.spinner.classList.toggle("d-none");
  }

  async deleteTask() {
    try {
      this.toggleSpinner();
      await deleteDocument("tasks", this.id);
      this.toggleSpinner();
      document.getElementById(`task_${this.id}`).remove();
      const tasksContainer = document.getElementById("tasksContainer");
      if (tasksContainer.children.length == 0) insertNoTasksMessage();
    } catch (error) {
      alert("Error deleting task!");
      console.log(error);
    }
  }

  async updateTask() {
    await updateCollectionData("tasks", this.id, {
      number: this.number,
      title: this.title,
      scope: this.scope,
      scopeProgress: this.scopeProgress,
    });
  }

  updateNumberTitle(values) {
    const space = values.indexOf(" ");
    const nb = space === -1 ? values : values.slice(0, space);
    const title = space === -1 ? "" : values.slice(space + 1);
    this.number = nb;
    this.title = title;
  }

  updateScope() {
    if (this.editTaskBtn.innerHTML.includes("bi-floppy")) {
      const newScope = prompt(
        'Enter new project. Make sure the scopes are comma-seperated. For example: "M E P" not "MEP"',
        "M E P",
      ).trim();

      //If scope hasn't changed
      if (newScope === this.scope) return;

      //Updating task scope and scope badge
      this.scope = newScope;
      this.taskScope.innerHTML = this.stringifyScope();

      //Updating scope progress html elements
      //Step 1: delete removed scope
      for (const [key, value] of Object.entries(this.scopeProgress)) {
        if (!this.scope.includes(key)) {
          document.getElementById(`${key}_ScopeProgress_${this.id}`).remove();
          delete this.scopeProgress[key];
        }
      }
      //Step 2: update this.scopeProgress and its html element
      const scopeArray = this.scope.split(" ");
      scopeArray.forEach((scope) => {
        if (!Object.hasOwn(this.scopeProgress, scope)) {
          this.scopeProgress[scope] = {
            assignedTo: "",
            isCompleted: false,
            situation: "",
          };
          const newHTMLobject = this.stringifyOneScopeProgress(
            scope,
            this.scopeProgress[scope],
            false,
          );
          this.scopeContainer.insertAdjacentHTML("beforeend", newHTMLobject);
          const newScopeProgress = this.scopeContainer.querySelector(
            `#${scope}_ScopeProgress_${this.id}`,
          );
          const fields = newScopeProgress.querySelectorAll(`.input_${this.id}`);
          Array.from(fields).forEach((field) => {
            field.addEventListener("input", () =>
              this.updateScopeProgress(field),
            );
          });
        }
      });
    } else {
      alert("You must be editing this task in order to alter its scope!");
    }
  }

  updateScopeProgress(inputField) {
    const scopeProps = inputField.id.split("_");
    const value = inputField.value.trim();
    if (inputField.type == "text") {
      this.scopeProgress[scopeProps[0]][scopeProps[1]] = value;
    } else {
      this.scopeProgress[scopeProps[0]][scopeProps[1]] =
        value == "false" ? false : true;
    }
  }

  stringifyScope() {
    let HTMLstring = "";
    const scopeArray = this.scope.split(" ");
    scopeArray.forEach((scope) => {
      HTMLstring += `<span class="${scope}-Scope Scope-Text"> ${scope} </span>`;
    });
    return HTMLstring;
  }

  stringifyScopeProgress() {
    let HTMLstring = "";
    for (const [key, value] of Object.entries(this.scopeProgress)) {
      HTMLstring += this.stringifyOneScopeProgress(key, value);
    }
    return HTMLstring;
  }

  stringifyOneScopeProgress(key, value, disabled = true) {
    const HTMLstring = `<!-- ${key} Scope Progress -->
              <div class="row col text-start mb-1" id="${key}_ScopeProgress_${this.id}">
                <h5 class="row mb-2">${key} Progress</h5>
                <div class="input-group mb-1">
                  <span class="input-group-text">Assigned to:</span>
                  <input
                    type="text"
                    class="form-control input_${this.id}"
                    placeholder="Engineer Name"
                    aria-label="Engineer Name"
                    id="${key}_assignedTo_${this.id}"
                    value="${value.assignedTo}"
                    ${disabled ? "disabled" : ""}
                  />
                </div>
                <div class="input-group mb-1">
                  <label class="input-group-text" for="${key}_isCompleted_${this.id}"
                    >Is Completed?</label
                  >
                  <select class="form-select input_${this.id}" id="${key}_isCompleted_${this.id}" ${disabled ? "disabled" : ""}>
                    <option value="true" ${value.isCompleted ? "selected" : ""}>Yes</option>
                    <option value="false" ${!value.isCompleted ? "selected" : ""}>No</option>
                  </select>
                </div>
                <div class="input-group mb-1">
                  <span class="input-group-text">Situation: </span>
                  <input
                    type="text"
                    class="form-control input_${this.id}"
                    placeholder="Situation"
                    aria-label="Situation"
                    id="${key}_situation_${this.id}"
                    ${disabled ? "disabled" : ""}
                    value="${value.situation}"
                  />
                </div>
              </div>`;
    return HTMLstring;
  }

  buildTaskCard() {
    return `<div class="col" id="task_${this.id}">
        <div class="card">
          <!-- Card Header -->
          <div class="card-header">
            <!-- Task Scope & Quick Actions -->
            <div class="row flex-nowrap justify-content-between">
              <!-- Task Scope -->
              <div class="col text-start align-items-center d-flex">
                <div
                  class="badge border border-dark p-2 btn btn-outline-primary taskScope"
                  id="taskScope_${this.id}"
                  title="Task Scope"
                >
                ${this.stringifyScope()}
                </div>
              </div>

              <!-- Spinner -->
              <div id="spinner_${this.id}"
                class="col d-flex align-items-center justify-content-center d-none">
                <div class="spinner-border spinner-border-sm" role="status"></div>
              </div>

              <!-- Quick Actions -->
              <div class="col text-end">
                <div class="btn-group btn-group-sm align-items-center" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-success"
                    id="editTaskBtn_${this.id}"
                    title="Edit Task"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    id="editScopeBtn_${this.id}"
                    title="Edit Scope"
                  >
                    <i class="bi bi-list-ul"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    id="deleteTaskBtn_${this.id}"
                    title="Delete Task"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <!-- Task Nb & Title -->
            <input type="text"
              class="form-control-plaintext fs-4 m-0 p-0 fw-medium"
              placeholder="Number"
              aria-label="Number"
              id="number_title_${this.id}"
              value="${this.number + " " + this.title}"
              disabled>
            <hr />

            <!-- Task Scope Progress -->
            <div class="card-text col" id="scopeContainer_${this.id}">
              ${this.stringifyScopeProgress()}
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="col">
              <small class="text-muted row" id="isLockedBy_${this.id}">Locked By: ${this.isLockedBy}</small>
              <small class="text-muted row" id="dateCreated_${this.id}"
                >Created on: ${this.dateCreated}
              </small>
            </div>
          </div>
        </div>
      </div>`;
  }
}
