CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at NUMERIC DEFAULT (DATETIME('NOW')),
  updated_at NUMERIC DEFAULT (DATETIME('NOW')),
  name TEXT,
  year NUMERIC,
  theater_id INTEGER,
 FOREIGN KEY(theater_id) REFERENCES theaters(id) ON DELETE CASCADE ON UPDATE CASCADE
);
