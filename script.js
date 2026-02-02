const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const darkToggle = document.getElementById("dark-toggle");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let hoveredIndex = null;

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = "";

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  filteredTodos.forEach((todo) => {
    const index = todos.indexOf(todo);
    const li = document.createElement("li");
    li.textContent = todo.text;

    if (todo.completed) li.classList.add("completed");

    li.addEventListener("mouseenter", () => hoveredIndex = index);

    li.addEventListener("click", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;

  todos.push({ text: input.value, completed: false });
  input.value = "";
  saveTodos();
  renderTodos();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" && hoveredIndex !== null) {
    todos.splice(hoveredIndex, 1);
    saveTodos();
    renderTodos();
    hoveredIndex = null;
  }
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderTodos();