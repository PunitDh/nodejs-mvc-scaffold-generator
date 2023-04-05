CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  password TEXT,
  created_at DATE DEFAULT (DATETIME('NOW')),
  updated_at DATE DEFAULT (DATETIME('NOW'))
);
