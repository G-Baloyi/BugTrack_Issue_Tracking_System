function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin001") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  } else {
    const err = document.getElementById("loginError");
    if (err) {
      err.style.display = "block";
      err.textContent = "Invalid username or password. Please try again.";
    } else {
      alert("Invalid username or password.");
    }
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

function checkAuth() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains("dark-mode");

  if (isDark) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  }
  updateThemeIcon();
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  }
}

function addThemeToggle() {
  const topbarRight = document.querySelector(".topbar-right");
  if (topbarRight && !document.getElementById("themeToggle")) {
    const themeBtn = document.createElement("button");
    themeBtn.id = "themeToggle";
    themeBtn.className = "btn-logout";
    themeBtn.innerHTML =
      '<i class="fas fa-sun"></i><i class="fas fa-moon" style="display:none"></i>';
    themeBtn.onclick = toggleTheme;
    topbarRight.insertBefore(themeBtn, topbarRight.firstChild);
    updateThemeIcon();
  }
}

function updateThemeIcon() {
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    const isDark = document.body.classList.contains("dark-mode");
    const sunIcon = themeBtn.querySelector(".fa-sun");
    const moonIcon = themeBtn.querySelector(".fa-moon");
    if (isDark) {
      sunIcon.style.display = "inline-block";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
