import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: "AIzaSyALSbpbRgRMlya6ng-9W8jy6ptaHceOdgM",
  authDomain: "focusflow-a6c20.firebaseapp.com",
  projectId: "focusflow-a6c20",
  storageBucket: "focusflow-a6c20.firebasestorage.app",
  messagingSenderId: "1011352514136",
  appId: "1:1011352514136:web:3565475e3c7c699e4b242d"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

const JWT_SECRET = "supersecretkey"; // ⚠️ move to .env in production

// --- AUTH MIDDLEWARE ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; // { username: "..." }
    next();
  });
}

// --- AUTH ROUTES ---
// Register
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    const userRef = doc(db, "users", username);
    const existing = await getDoc(userRef);
    if (existing.exists()) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await setDoc(userRef, {
      fullName,
      email,
      username,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = userSnap.data();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASK ROUTES (protected by authMiddleware) ---

// Add Task
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const task = { ...req.body, username: req.user.username }; // attach owner
    const docRef = await addDoc(collection(db, "tasks"), task);
    res.json({ id: docRef.id, ...task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks (only user’s tasks)
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const q = query(collection(db, "tasks"), where("username", "==", req.user.username));
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    const taskRef = doc(db, "tasks", taskId);

    // Ensure task belongs to user
    const snap = await getDoc(taskRef);
    if (!snap.exists() || snap.data().username !== req.user.username) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await updateDoc(taskRef, updates);
    res.json({ id: taskId, ...updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskRef = doc(db, "tasks", taskId);

    const snap = await getDoc(taskRef);
    if (!snap.exists() || snap.data().username !== req.user.username) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await deleteDoc(taskRef);
    res.json({ message: "Task deleted", id: taskId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(3000, () => console.log("✅ API running at http://localhost:3000"));
