let display = document.getElementById("display");
let toggle = document.getElementById("themeToggle");
let modeToggle = document.getElementById("modeToggle");
let angleToggle = document.getElementById("angleToggle");
let sciButtons = document.querySelector(".scientific");
let historyList = document.getElementById("historyList");

/* ---------- Angle Mode ---------- */
let angleMode = localStorage.getItem("angleMode") || "DEG";
angleToggle.textContent = angleMode;

function toRadians(value) {
  return angleMode === "DEG" ? value * (Math.PI / 180) : value;
}

/* ---------- Calculator Core ---------- */
function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculateResult() {
  try {
    let expression = display.value;

    expression = expression
      .replace(/Math\.sin\(([^)]+)\)/g, "Math.sin(toRadians($1))")
      .replace(/Math\.cos\(([^)]+)\)/g, "Math.cos(toRadians($1))")
      .replace(/Math\.tan\(([^)]+)\)/g, "Math.tan(toRadians($1))");

    const result = eval(expression);
    display.value = result;
    saveHistory(display.value, result);
  } catch {
    display.value = "Error";
  }
}

/* ---------- Theme ---------- */
function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}
setTheme(localStorage.getItem("theme") || "light");

toggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

/* ---------- Angle Toggle ---------- */
angleToggle.addEventListener("click", () => {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  angleToggle.textContent = angleMode;
  localStorage.setItem("angleMode", angleMode);
});

/* ---------- Scientific Mode ---------- */
modeToggle.addEventListener("click", () => {
  sciButtons.classList.toggle("hidden");
});

/* ---------- History ---------- */
function saveHistory(exp, res) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift(`${exp} = ${res}`);
  history = history.slice(0, 10);
  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => {
      display.value = item.split("=")[1].trim();
    };
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}
renderHistory();

/* ---------- Keyboard ---------- */
document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key) || e.key === ".") appendValue(e.key);
  if (["+", "-", "*", "/"].includes(e.key)) appendValue(e.key);
  if (e.key === "Enter") calculateResult();
  if (e.key === "Backspace")
    display.value = display.value.slice(0, -1);
  if (e.key === "Escape") clearDisplay();
});
