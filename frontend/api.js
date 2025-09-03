const API_URL = "http://localhost:3000"; // later, change when deployed

// Utility: get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Get all tasks, but only those for today (used in today.html)
export async function getTasks(filterToday = false) {
  const res = await fetch(`${API_URL}/tasks`);
  const tasks = await res.json();

  if (filterToday) {
    const today = getTodayDate();
    return tasks.filter(task => task.dueDate === today);
  }
  return tasks;
}

// Create a new task, with today's date + priority if not provided
export async function addTask(title, dueDate = null, priority = "Medium") {
  const today = getTodayDate();
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      dueDate: dueDate || today,
      priority,       // 👈 add priority
      done: false,
    }),
  });
  return res.json();
}


// Update a task
export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

// Delete a task
export async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
}
