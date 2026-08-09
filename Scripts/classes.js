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
  }

  editTask() {
    const editTaskBtn = document.getElementById(`editTaskBtn_${this.id}`);
    this.toggleInputFields();
    if (!editTaskBtn) return;
    // toggle icon: prefer checking for the pencil class to avoid exact HTML string matching
    if (editTaskBtn.innerHTML.includes("bi-pencil")) {
      editTaskBtn.innerHTML = '<i class="bi bi-floppy"></i>';
    } else {
      editTaskBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    }
  }

  toggleInputFields() {
    const scopeArray = this.scope.split(" ");
    scopeArray.forEach((scope) => {
      const assignedTo = document.getElementById(
        `${scope}AssignedTo_${this.id}`,
      );
      const isCompleted = document.getElementById(
        `${scope}IsCompleted_${this.id}`,
      );
      const situation = document.getElementById(`${scope}Situation_${this.id}`);
      if (assignedTo) assignedTo.disabled = !assignedTo.disabled;
      if (isCompleted) isCompleted.disabled = !isCompleted.disabled;
      if (situation) situation.disabled = !situation.disabled;
    });
  }

  deleteTask() {
    // implement task deletion logic here
  }

  updateTask() {
    // implement task update logic here
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
      HTMLstring += `<!-- ${key} Scope Progress -->
              <div class="row col text-start mb-1">
                <h5 class="row mb-2">${key} Progress</h5>
                <div class="input-group mb-1">
                  <span class="input-group-text">Assigned to:</span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Engineer Name"
                    aria-label="Engineer Name"
                    id="${key}AssignedTo_${this.id}"
                    value="${value.assignedTo}"
                    disabled
                  />
                </div>
                <div class="input-group mb-1">
                  <label class="input-group-text" for="${key}IsCompleted_${this.id}"
                    >Is Completed?</label
                  >
                  <select class="form-select" id="${key}IsCompleted_${this.id}" disabled>
                    <option value="true" ${value.isCompleted ? "selected" : ""}>Yes</option>
                    <option value="false" ${!value.isCompleted ? "selected" : ""}>No</option>
                  </select>
                </div>
                <div class="input-group mb-1">
                  <span class="input-group-text">Situation: </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Situation"
                    aria-label="Situation"
                    id="${key}Situation_${this.id}"
                    disabled
                    value="${value.situation}"
                  />
                </div>
              </div>`;
    }
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
                >
                ${this.stringifyScope()}
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="col text-end">
                <div class="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-success"
                    id="editTaskBtn_${this.id}"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    id="lockTaskBtn_${this.id}"
                  >
                    <i class="${this.isLocked ? "bi bi-unlock" : "bi bi-lock"}"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    id="deleteTaskBtn_${this.id}"
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
            <h4 class="card-title" id="taskNbTitle_${this.id}">${this.number + " " + this.title}</h4>
            <hr />

            <!-- Task Scope Progress -->
            <div class="card-text col" id="scopeContainer_${this.id}">
              ${this.stringifyScopeProgress()}
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="col">
              <small class="text-muted row" id="islockedBy_${this.id}">Locked By: ${this.isLockedBy}</small>
              <small class="text-muted row" id="dateCreated_${this.id}"
                >Created on: ${this.dateCreated}
              </small>
            </div>
          </div>
        </div>
      </div>`;
  }

  lockTask(name) {
    // implement task locking logic here
  }
}
