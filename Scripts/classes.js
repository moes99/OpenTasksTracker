export class Admin {
  constructor(id, name, email, isSuperAdmin) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isSuperAdmin = isSuperAdmin;
  }
}

export class Task {
  constructor(
    id,
    title,
    number,
    scope,
    dateCreated,
    mAssignedTo,
    mStatus,
    mCompleted,
    eAssignedTo,
    eStatus,
    eCompleted,
    pAssignedTo,
    pStatus,
    pCompleted,
    lastSubmission,
    isLocked,
    isLockedBy,
  ) {
    this.id = id;
    this.title = title;
    this.number = number;
    this.scope = scope;
    this.dateCreated = dateCreated;
    this.mAssignedTo = mAssignedTo;
    this.mStatus = mStatus;
    this.mCompleted = mCompleted;
    this.eAssignedTo = eAssignedTo;
    this.eStatus = eStatus;
    this.eCompleted = eCompleted;
    this.pAssignedTo = pAssignedTo;
    this.pStatus = pStatus;
    this.pCompleted = pCompleted;
    this.lastSubmission = lastSubmission;
    this.isLocked = isLocked;
    this.isLockedBy = isLockedBy;
  }
}
