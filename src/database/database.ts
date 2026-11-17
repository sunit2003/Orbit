import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("orbit.db");

export function initializeDatabase() {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS payment_modes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('cash', 'bank')),
      balance REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'Expense',
      amount REAL NOT NULL,
      category_id TEXT,
      payment_mode_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      note TEXT,
      FOREIGN KEY (payment_mode_id) REFERENCES payment_modes(id)
    );
  `);

  // Seed default cash payment mode if it doesn't exist
  db.execSync(`
    INSERT INTO payment_modes (name, type, balance)
    SELECT 'Cash', 'cash', 0.0
    WHERE NOT EXISTS (
      SELECT 1 FROM payment_modes WHERE name = 'Cash' AND type = 'cash'
    );
  `);

  // Migration: Add 'balance' column to 'payment_modes' if it doesn't exist
  // try {
  //   db.execSync("ALTER TABLE payment_modes ADD COLUMN balance REAL NOT NULL DEFAULT 0;");
  //   console.log("Migration: Added 'balance' column to 'payment_modes' successfully.");
  // } catch (error) {
  //   // If the column already exists, SQLite will throw an error which we can safely ignore
  // }
}

export function getDatabaseTables(): string[] {
  const result = db.getAllSync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
  );
  return result.map((row) => row.name);
}
