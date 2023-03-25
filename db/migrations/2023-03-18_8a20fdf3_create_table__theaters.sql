CREATE TABLE IF NOT EXISTS theaters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at NUMERIC DEFAULT (DATETIME('NOW')),
  updated_at NUMERIC DEFAULT (DATETIME('NOW')),
  name TEXT,
  location TEXT
);