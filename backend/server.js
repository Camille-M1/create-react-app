const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./database");

const PORT = 5050;

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function startServer() {
  try {
    db = await initializeDatabase();

    // Root
    app.get("/", (req, res) => {
      res.send("TaskPilot Backend Running with SQLite");
    });

    // GET ALL TASKS
    app.get("/api/tasks", async (req, res) => {
      try {
        const tasks = await db.all("SELECT * FROM tasks");
        res.json(tasks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tasks" });
      }
    });

    // GET SINGLE TASK
    app.get("/api/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const task = await db.get(
          "SELECT * FROM tasks WHERE id = ?",
          [id]
        );

        if (!task) {
          return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch task" });
      }
    });

    // CREATE TASK
    app.post("/api/tasks", async (req, res) => {
      try {
        const {
          title,
          description,
          status = "todo",
          priority = "medium",
          dueDate,
          assignedTo,
          teamId
        } = req.body;

        if (!title) {
          return res.status(400).json({ error: "Title is required" });
        }

        const result = await db.run(
          `INSERT INTO tasks (title, description, status, priority, dueDate, assignedTo, teamId)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [title, description, status, priority, dueDate, assignedTo, teamId]
        );

        res.status(201).json({
          id: result.lastID,
          title,
          description,
          status,
          priority,
          dueDate,
          assignedTo,
          teamId
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create task" });
      }
    });

    // UPDATE TASK STATUS
    app.put("/api/tasks/:id", async (req, res) => {
      try {
        const { status } = req.body;
        const { id } = req.params;

        await db.run(
          "UPDATE tasks SET status = ? WHERE id = ?",
          [status, id]
        );

        res.json({ message: "Task updated successfully" });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update task" });
      }
    });

    // DELETE TASK
    app.delete("/api/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;

        await db.run("DELETE FROM tasks WHERE id = ?", [id]);

        res.json({ message: "Task deleted successfully" });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete task" });
      }
    });

    // GET COMMENTS FOR TASK
    app.get("/api/tasks/:id/comments", async (req, res) => {
      try {
        const { id } = req.params;

        const comments = await db.all(
          "SELECT * FROM comments WHERE taskId = ? ORDER BY createdAt DESC",
          [id]
        );

        res.json(comments);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch comments" });
      }
    });

    // CREATE COMMENT
    app.post("/api/tasks/:id/comments", async (req, res) => {
      try {
        const { id } = req.params;
        const { author, text } = req.body;

        if (!text) {
          return res.status(400).json({ error: "Comment text required" });
        }

        const createdAt = new Date().toISOString();

        const result = await db.run(
          `INSERT INTO comments (taskId, author, text, createdAt)
           VALUES (?, ?, ?, ?)`,
          [id, author || "Anonymous", text, createdAt]
        );

        res.status(201).json({
          id: result.lastID,
          taskId: id,
          author: author || "Anonymous",
          text,
          createdAt
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create comment" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database failed to initialize:", error);
  }
}

startServer();