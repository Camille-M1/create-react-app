const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

async function initializeDatabase() {
  const db = await open({
    filename: path.join(__dirname, "taskpilot.db"),
    driver: sqlite3.Database
  });

  // Enable foreign key support
  await db.exec(`PRAGMA foreign_keys = ON;`);

  //  Tasks table 
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'medium',
      dueDate DATETIME,
      assignedTo INTEGER,
      teamId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Comments table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      taskId INTEGER NOT NULL,
      author TEXT,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      role TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Teams table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      leaderId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("SQLite Database Ready");
  return db;
}

module.exports = initializeDatabase;