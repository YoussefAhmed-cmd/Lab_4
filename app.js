"use strict";
const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const itemsLeft = document.getElementById("items-left");
const clearCompleted = document.getElementById("clear-completed");
const clearAll = document.getElementById("clear-all");
let todos = [
    { id: 1, text: "See Lecture", completed: false },
    { id: 2, text: "Solve assignment", completed: false }
];
let nextId = 3;
let currentFilter = "all";
function renderTodos() {
    taskList.innerHTML = "";
    const visibleTodos = todos.filter((todo) => currentFilter === "all" ||
        (currentFilter === "active" && !todo.completed) ||
        (currentFilter === "completed" && todo.completed));
    visibleTodos.forEach((todo) => {
        const item = document.createElement("li");
        item.className = todo.completed ? "task completed" : "task";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute("aria-label", "Mark " + todo.text + " completed");
        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            renderTodos();
        });
        const label = document.createElement("span");
        label.className = "task-label";
        label.textContent = todo.text;
        label.title = "Double-click to edit";
        label.addEventListener("dblclick", () => editTodo(todo, item));
        const remove = document.createElement("button");
        remove.className = "delete-button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Delete " + todo.text);
        remove.addEventListener("click", () => {
            todos = todos.filter((t) => t.id !== todo.id);
            renderTodos();
        });
        item.append(checkbox, label, remove);
        taskList.appendChild(item);
    });
    const remaining = todos.filter((todo) => !todo.completed).length;
    itemsLeft.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} left`;
}
function editTodo(todo, item) {
    const label = item.querySelector(".task-label");
    const editInput = document.createElement("input");
    editInput.className = "edit-input";
    editInput.value = todo.text;
    label.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    let finished = false;
    const finish = (save) => {
        if (finished)
            return;
        finished = true;
        const newText = editInput.value.trim();
        if (save && newText)
            todo.text = newText;
        renderTodos();
    };
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter")
            finish(true);
        if (event.key === "Escape")
            finish(false);
    });
    editInput.addEventListener("blur", () => finish(true));
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text)
        return;
    todos.push({ id: nextId++, text, completed: false });
    taskInput.value = "";
    renderTodos();
});
document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        document.querySelectorAll(".filter").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        renderTodos();
    });
});
clearCompleted.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.completed);
    renderTodos();
});
clearAll.addEventListener("click", () => {
    todos = [];
    renderTodos();
});
renderTodos();
