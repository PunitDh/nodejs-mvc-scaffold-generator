CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  address TEXT,
  number_of_employees NUMERIC,
  created_at DATE DEFAULT (DATETIME('NOW')),
  updated_at DATE DEFAULT (DATETIME('NOW'))
);
