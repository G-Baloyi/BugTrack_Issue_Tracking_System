function initStorage() {
  if (!localStorage.getItem("bugtrack_issues")) {
    const defaultIssues = [
      {
        id: 1001,
        summary: "Login page responsiveness broken on mobile",
        description:
          "The login page doesn't scale properly on devices under 768px width. Buttons overlap and text is cut off.",
        identifiedBy: 1,
        dateIdentified: "2024-01-15",
        projectId: 1,
        assignedTo: 2,
        status: "open",
        priority: "high",
        targetResoDate: "2024-01-25",
        actualResoDate: "",
        resoSummary: "",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: 1002,
        summary: "API timeout on report generation",
        description:
          "Generating reports with date range >30 days causes timeout after 30 seconds.",
        identifiedBy: 1,
        dateIdentified: "2024-01-18",
        projectId: 2,
        assignedTo: 3,
        status: "overdue",
        priority: "high",
        targetResoDate: "2024-01-22",
        actualResoDate: "",
        resoSummary: "",
        createdAt: "2024-01-18T14:30:00Z",
      },
      {
        id: 1003,
        summary: "Dark mode toggle not persisting user preference",
        description:
          "User's dark/light mode preference resets after page refresh.",
        identifiedBy: 2,
        dateIdentified: "2024-01-20",
        projectId: 1,
        assignedTo: 1,
        status: "resolved",
        priority: "medium",
        targetResoDate: "2024-01-28",
        actualResoDate: "2024-01-26",
        resoSummary: "Added localStorage persistence for theme preference",
        createdAt: "2024-01-20T09:15:00Z",
      },
    ];
    localStorage.setItem("bugtrack_issues", JSON.stringify(defaultIssues));
  }

  if (!localStorage.getItem("bugtrack_projects")) {
    const defaultProjects = [
      {
        id: 1,
        name: "BugTrack Core",
        key: "BTCORE",
        description: "Main application development",
      },
      {
        id: 2,
        name: "Mobile App",
        key: "MOBILE",
        description: "iOS and Android apps",
      },
      {
        id: 3,
        name: "API Gateway",
        key: "APIGW",
        description: "Backend services",
      },
    ];
    localStorage.setItem("bugtrack_projects", JSON.stringify(defaultProjects));
  }

  if (!localStorage.getItem("bugtrack_people")) {
    const defaultPeople = [
      {
        id: 1,
        name: "Alex",
        surname: "Chen",
        username: "alex.chen",
        role: "Lead Developer",
        email: "alex@bugtrack.com",
      },
      {
        id: 2,
        name: "Jamie",
        surname: "Smith",
        username: "jamie.smith",
        role: "Frontend Dev",
        email: "jamie@bugtrack.com",
      },
      {
        id: 3,
        name: "Taylor",
        surname: "Wong",
        username: "taylor.wong",
        role: "Backend Dev",
        email: "taylor@bugtrack.com",
      },
    ];
    localStorage.setItem("bugtrack_people", JSON.stringify(defaultPeople));
  }

  if (!localStorage.getItem("bugtrack_comments")) {
    const defaultComments = [
      {
        id: 5001,
        issueId: 1001,
        author: "Jamie Smith",
        text: "Looking into this now. Should have a fix by EOD.",
        createdAt: "2024-01-16T11:20:00Z",
      },
      {
        id: 5002,
        issueId: 1002,
        author: "Taylor Wong",
        text: "Need to optimize the query. Will break into smaller chunks.",
        createdAt: "2024-01-19T09:45:00Z",
      },
    ];
    localStorage.setItem("bugtrack_comments", JSON.stringify(defaultComments));
  }
}

function getIssues() {
  return JSON.parse(localStorage.getItem("bugtrack_issues") || "[]");
}

function saveIssues(issues) {
  localStorage.setItem("bugtrack_issues", JSON.stringify(issues));
}

function addIssue(issue) {
  const issues = getIssues();
  issues.push(issue);
  saveIssues(issues);
}

function updateIssue(id, updatedIssue) {
  const issues = getIssues();
  const index = issues.findIndex((i) => i.id === id);
  if (index !== -1) {
    issues[index] = { ...issues[index], ...updatedIssue };
    saveIssues(issues);
  }
}

function deleteIssue(id) {
  const issues = getIssues();
  saveIssues(issues.filter((i) => i.id !== id));
}

function getProjects() {
  return JSON.parse(localStorage.getItem("bugtrack_projects") || "[]");
}

function saveProjects(projects) {
  localStorage.setItem("bugtrack_projects", JSON.stringify(projects));
}

function getProjectName(projectId) {
  const project = getProjects().find((p) => p.id === projectId);
  return project ? project.name : "Unknown Project";
}

function getPeople() {
  return JSON.parse(localStorage.getItem("bugtrack_people") || "[]");
}

function savePeople(people) {
  localStorage.setItem("bugtrack_people", JSON.stringify(people));
}

function getPersonName(personId) {
  if (!personId) return "Unassigned";
  const person = getPeople().find((p) => p.id === personId);
  return person ? `${person.name} ${person.surname}` : "Unknown";
}

function getComments() {
  return JSON.parse(localStorage.getItem("bugtrack_comments") || "[]");
}

function saveComments(comments) {
  localStorage.setItem("bugtrack_comments", JSON.stringify(comments));
}

function addComment(comment) {
  const comments = getComments();
  comments.push(comment);
  saveComments(comments);
}

initStorage();
