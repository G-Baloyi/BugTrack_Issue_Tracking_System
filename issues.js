function getNextId() {
  const issues = getIssues();
  return issues.length > 0 ? issues[issues.length - 1].id + 1 : 1;
}

function findIssueById(id) {
  return getIssues().find((issue) => issue.id === id);
}

function getPersonName(id) {
  if (!id) return "Unassigned";
  const person = getPeople().find((p) => p.id === id);
  return person ? `${person.name} ${person.surname}` : "Unassigned";
}

function getProjectName(id) {
  const project = getProjects().find((p) => p.id === id);
  return project ? project.name : "Unknown Project";
}

// Populate dropdowns
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createIssueForm");
  if (form) {
    populateDropdowns();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      createIssue();
    });
  }

  // Load all issues if on that page
  if (document.getElementById("issuesTableBody")) {
    loadAllIssues();
    setupFilters();
  }

  // Load my issues if on that page
  if (document.getElementById("myIssuesBody")) {
    loadMyIssues();
  }
});

function populateDropdowns() {
  const people = getPeople();
  const projects = getProjects();

  const assignedTo = document.getElementById("issueAssignee");
  const identifiedBy = document.getElementById("issueIdentifiedBy");
  const project = document.getElementById("issueProject");

  if (assignedTo) {
    assignedTo.innerHTML = '<option value="">Unassigned</option>';
    people.forEach((person) => {
      assignedTo.innerHTML += `<option value="${person.id}">${person.name} ${person.surname}</option>`;
    });
  }

  if (identifiedBy) {
    identifiedBy.innerHTML = '<option value="">Select Person</option>';
    people.forEach((person) => {
      identifiedBy.innerHTML += `<option value="${person.id}">${person.name} ${person.surname}</option>`;
    });
  }

  if (project) {
    project.innerHTML = '<option value="">Select Project</option>';
    projects.forEach((proj) => {
      project.innerHTML += `<option value="${proj.id}">${proj.name}</option>`;
    });
  }
}

function createIssue() {
  const issues = getIssues();
  const newIssue = {
    id: getNextId(),
    summary: document.getElementById("issueSummary").value,
    description: document.getElementById("issueDescription").value,
    identifiedBy:
      parseInt(document.getElementById("issueIdentifiedBy").value) || null,
    dateIdentified: document.getElementById("issueIdentifiedDate").value,
    projectId: parseInt(document.getElementById("issueProject").value),
    assignedTo:
      parseInt(document.getElementById("issueAssignee").value) || null,
    status: "open",
    priority: document.getElementById("issuePriority").value,
    targetResoDate: document.getElementById("issueTargetDate").value,
    actualResoDate: "",
    resoSummary: "",
  };

  issues.push(newIssue);
  saveIssues(issues);

  alert("Issue created successfully!");
  window.location.href = "view-all-issues.html";
}

function setupFilters() {
  const search = document.getElementById("searchInput");
  const status = document.getElementById("filterStatus");
  const priority = document.getElementById("filterPriority");
  const project = document.getElementById("filterProject");

  if (search) search.addEventListener("input", loadAllIssues);
  if (status) status.addEventListener("change", loadAllIssues);
  if (priority) priority.addEventListener("change", loadAllIssues);
  if (project) project.addEventListener("change", loadAllIssues);

  // Populate project filter
  const projectFilter = document.getElementById("filterProject");
  if (projectFilter) {
    const projects = getProjects();
    projectFilter.innerHTML = '<option value="">📁 All Projects</option>';
    projects.forEach((proj) => {
      projectFilter.innerHTML += `<option value="${proj.id}">${proj.name}</option>`;
    });
  }
}

function loadAllIssues() {
  const table = document.getElementById("issuesTableBody");
  if (!table) return;

  const allIssues = getIssues();
  const searchValue =
    document.getElementById("searchInput")?.value.toLowerCase() || "";
  const statusValue = document.getElementById("filterStatus")?.value || "";
  const priorityValue = document.getElementById("filterPriority")?.value || "";
  const projectValue = document.getElementById("filterProject")?.value || "";

  const issues = allIssues.filter((issue) => {
    const matchesSearch = issue.summary.toLowerCase().includes(searchValue);
    const matchesStatus = statusValue
      ? issue.status.toLowerCase() === statusValue
      : true;
    const matchesPriority = priorityValue
      ? issue.priority === priorityValue
      : true;
    const matchesProject = projectValue
      ? String(issue.projectId) === projectValue
      : true;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  if (issues.length === 0) {
    table.innerHTML =
      "<tr><td colspan='8' class='empty-state-text'>No issues found</td></tr>";
    return;
  }

  table.innerHTML = issues
    .map(
      (issue) => `
        <tr>
            <td><span class="issue-id-badge">#${issue.id}</span></td>
            <td><strong>${escapeHtml(issue.summary)}</strong></td>
            <td>${getProjectName(issue.projectId)}</td>
            <td>${getPersonName(issue.assignedTo)}</td>
            <td><span class="priority-badge priority-${issue.priority}">${issue.priority.toUpperCase()}</span></td>
            <td><span class="status-badge status-${issue.status}">${issue.status.toUpperCase()}</span></td>
            <td>${issue.targetResoDate || "N/A"}</td>
            <td class="action-buttons">
                <button class="btn-view" onclick="viewIssue(${issue.id})"><i class="fas fa-eye"></i> View</button>
                <button class="btn-edit" onclick="editIssue(${issue.id})"><i class="fas fa-edit"></i> Edit</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function editIssue(id) {
  window.location.href = `edit-issue.html?id=${id}`;
}

function viewIssue(id) {
  const issue = findIssueById(id);
  const modal = document.getElementById("viewIssueModal");
  const content = document.getElementById("modalIssueContent");

  if (!issue || !modal || !content) return;

  content.innerHTML = `
        <div class="detail-card">
            <div class="detail-header">
                <div>
                    <h4>${escapeHtml(issue.summary)}</h4>
                    <span class="detail-id">Issue #${issue.id}</span>
                </div>
                <span class="status-badge status-${issue.status}">${issue.status.toUpperCase()}</span>
            </div>
            <div class="detail-grid">
                <div><span class="detail-label">Priority</span><span class="priority-badge priority-${issue.priority}">${issue.priority.toUpperCase()}</span></div>
                <div><span class="detail-label">Project</span>${getProjectName(issue.projectId)}</div>
                <div><span class="detail-label">Identified By</span>${getPersonName(issue.identifiedBy)}</div>
                <div><span class="detail-label">Date Identified</span>${issue.dateIdentified}</div>
                <div><span class="detail-label">Assigned To</span>${getPersonName(issue.assignedTo)}</div>
                <div><span class="detail-label">Target Date</span>${issue.targetResoDate || "N/A"}</div>
                <div><span class="detail-label">Actual Resolution</span>${issue.actualResoDate || "N/A"}</div>
            </div>
            <div class="detail-description">
                <span class="detail-label">Description</span>
                <p>${escapeHtml(issue.description)}</p>
            </div>
            ${issue.resoSummary ? `<div class="detail-description"><span class="detail-label">Resolution Summary</span><p>${escapeHtml(issue.resoSummary)}</p></div>` : ""}
        </div>
    `;

  modal.classList.remove("hidden");
}

function closeViewModal() {
  document.getElementById("viewIssueModal").classList.add("hidden");
}

function loadIssueForEdit(id) {
  const issue = findIssueById(id);
  if (!issue) return;

  populateDropdowns();

  document.getElementById("issueId").value = issue.id;
  document.getElementById("issueSummary").value = issue.summary;
  document.getElementById("issueDescription").value = issue.description;
  document.getElementById("issueIdentifiedBy").value = issue.identifiedBy || "";
  document.getElementById("issueIdentifiedDate").value = issue.dateIdentified;
  document.getElementById("issueProject").value = issue.projectId;
  document.getElementById("issueAssignee").value = issue.assignedTo || "";
  document.getElementById("issueStatus").value = issue.status;
  document.getElementById("issuePriority").value = issue.priority;
  document.getElementById("issueTargetDate").value = issue.targetResoDate;
  document.getElementById("issueActualDate").value = issue.actualResoDate || "";
  document.getElementById("issueResolution").value = issue.resoSummary || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editIssueForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveEditedIssue();
    });
  }
});

function saveEditedIssue() {
  const issues = getIssues();
  const id = parseInt(document.getElementById("issueId").value);
  const index = issues.findIndex((issue) => issue.id === id);
  if (index === -1) return;

  issues[index].summary = document.getElementById("issueSummary").value;
  issues[index].description = document.getElementById("issueDescription").value;
  issues[index].identifiedBy =
    parseInt(document.getElementById("issueIdentifiedBy").value) || null;
  issues[index].dateIdentified = document.getElementById(
    "issueIdentifiedDate",
  ).value;
  issues[index].projectId = parseInt(
    document.getElementById("issueProject").value,
  );
  issues[index].assignedTo =
    parseInt(document.getElementById("issueAssignee").value) || null;
  issues[index].status = document.getElementById("issueStatus").value;
  issues[index].priority = document.getElementById("issuePriority").value;
  issues[index].targetResoDate =
    document.getElementById("issueTargetDate").value;
  issues[index].actualResoDate =
    document.getElementById("issueActualDate").value;
  issues[index].resoSummary = document.getElementById("issueResolution").value;

  saveIssues(issues);
  alert("Issue updated successfully!");
  window.location.href = "view-all-issues.html";
}

function deleteIssueFromEdit() {
  if (!confirm("Are you sure you want to delete this issue?")) return;
  const id = parseInt(document.getElementById("issueId").value);
  const issues = getIssues();
  const updatedIssues = issues.filter((issue) => issue.id !== id);
  saveIssues(updatedIssues);
  alert("Issue deleted successfully!");
  window.location.href = "view-all-issues.html";
}

function loadMyIssues() {
  const table = document.getElementById("myIssuesBody");
  if (!table) return;

  const issues = getIssues();
  // For demo, using first person as logged in user
  const people = getPeople();
  const currentUserId = people.length > 0 ? people[0].id : 1;
  const myIssues = issues.filter((issue) => issue.assignedTo === currentUserId);

  if (myIssues.length === 0) {
    table.innerHTML =
      "<tr><td colspan='7' class='empty-state-text'>No issues assigned to you</td></tr>";
    return;
  }

  table.innerHTML = myIssues
    .map(
      (issue) => `
        <tr>
            <td><span class="issue-id-badge">#${issue.id}</span></td>
            <td><strong>${escapeHtml(issue.summary)}</strong></td>
            <td>${getProjectName(issue.projectId)}</td>
            <td><span class="priority-badge priority-${issue.priority}">${issue.priority.toUpperCase()}</span></td>
            <td><span class="status-badge status-${issue.status}">${issue.status.toUpperCase()}</span></td>
            <td>${issue.targetResoDate || "N/A"}</td>
            <td class="action-buttons">
                <button class="btn-view" onclick="viewIssue(${issue.id})"><i class="fas fa-eye"></i> View</button>
                <button class="btn-edit" onclick="editIssue(${issue.id})"><i class="fas fa-edit"></i> Edit</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}
