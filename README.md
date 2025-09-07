# FocusFlow – To-Do App ✅

A full-stack To-Do list app built with:

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js + Express
- **Database:** Firebase Firestore
- **Auth:** JSON Web Tokens (JWT)

---

## 📌 Features
- User registration & login (JWT-based authentication)
- Create, update, mark as done, and delete tasks
- Task priority levels (Low, Medium, High)
- Calendar view of tasks by due date
- "Today" view to filter tasks due today
- Responsive UI with a clean layout

---

## 📂 Project Structure
To_Do_App/
│
├── focusflow-backend/ # Backend (Express + Firestore)
│ ├── index.js
│ ├── package.json
│ └── ...
│
├── frontend/ # Frontend (HTML, CSS, JS)
│ ├── homepage.html
│ ├── login.html
│ ├── register.html
│ ├── calendar.html
│ ├── today.html
│ ├── upcoming.html
│ ├── style.css
│ └── api.js
│
├── README.md
└── requirements.txt


---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Melckykaisha/To_Do_App.git
cd To_Do_App


2️⃣ Backend Setup (Node.js + Express)

Navigate to backend folder:

cd focusflow-backend


Install dependencies:

npm install


Run the backend server (with auto-reload using nodemon):

npx nodemon index.js


By default, the backend runs on:
http://localhost:3000

3️⃣ Frontend Setup

Open the frontend folder in VS Code.

Install the Live Server extension in VS Code.

Right-click on homepage.html (or login.html) → Open with Live Server.

This ensures API calls work properly while the backend runs in the background.