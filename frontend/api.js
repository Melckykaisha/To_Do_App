// API configuration for both development and production
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "/api";

// Utility: get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Get all tasks, but only those for today (used in today.html)
export async function getTasks(filterToday = false) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const tasks = await res.json();

  if (filterToday) {
    const today = getTodayDate();
    return tasks.filter(task => task.dueDate === today);
  }
  return tasks;
}

// Create a new task, with today's date + priority if not provided
export async function addTask(title, dueDate = null, priority = "Medium", note = "") {
  const token = localStorage.getItem("token");
  const today = getTodayDate();
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      dueDate: dueDate || today,
      priority,
      note,
      done: false,
    }),
  });
  return res.json();
}

// Update a task
export async function updateTask(id, updates) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updates),
  });
  return res.json();
}

// Delete a task
export async function deleteTask(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/tasks/${id}`, { 
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}