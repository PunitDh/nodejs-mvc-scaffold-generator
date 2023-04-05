CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  title TEXT,
  salary NUMERIC,
  sick_leave_hours NUMERIC,
  annual_leave_hours NUMERIC,
  company_id INTEGER,
  created_at DATE DEFAULT (DATETIME('NOW')),
  updated_at DATE DEFAULT (DATETIME('NOW')),
  FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE
);
