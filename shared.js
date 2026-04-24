function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i> ${message}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
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

function buildNavHTML(activePage) {
  const links = [
    {
      href: "dashboard.html",
      icon: "fa-tachometer-alt",
      label: "Dashboard",
      page: "dashboard",
    },
    {
      href: "create-issue.html",
      icon: "fa-plus-circle",
      label: "Create Issue",
      page: "create",
    },
    {
      href: "view-all-issues.html",
      icon: "fa-list-ul",
      label: "All Issues",
      page: "all-issues",
    },
    {
      href: "my-issues.html",
      icon: "fa-user-check",
      label: "My Issues",
      page: "my-issues",
    },
    { href: "people.html", icon: "fa-users", label: "People", page: "people" },
    {
      href: "projects.html",
      icon: "fa-project-diagram",
      label: "Projects",
      page: "projects",
    },
  ];
  const overdueCount = getIssues().filter((i) => i.status === "overdue").length;
  return links
    .map((l) => {
      const badge =
        l.page === "all-issues" && overdueCount > 0
          ? `<span class="nav-badge">${overdueCount}</span>`
          : "";
      return `<a href="${l.href}" class="nav-link${activePage === l.page ? " active" : ""}"><i class="fas ${l.icon}"></i>${l.label}${badge}</a>`;
    })
    .join("");
}

function buildShell(activePage, pageContent) {
  const user = localStorage.getItem("username") || "Admin";
  const initials = user.substring(0, 2).toUpperCase();
  document.body.innerHTML = `
        <div class="app-shell">
            <nav class="topbar">
                <a href="dashboard.html" class="topbar-logo"><i class="fas fa-bug"></i> BugTrack</a>
                <div class="topbar-right">
                    <div class="topbar-user">
                        <div class="topbar-avatar">${initials}</div>
                        <span class="topbar-username">${user}</span>
                    </div>
                    <button class="btn-logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
                </div>
            </nav>
            <div class="app-body">
                <aside class="sidebar">
                    <span class="nav-section-label">Navigation</span>
                    ${buildNavHTML(activePage)}
                </aside>
                <main class="main-content" id="pageMain">${pageContent}</main>
            </div>
        </div>
    `;
  initTheme();
  addThemeToggle();
}
