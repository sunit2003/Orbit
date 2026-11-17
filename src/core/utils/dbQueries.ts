import { AddExpenseParams, PaymentModeType, trxType } from "@/constants/types";
import { db } from "@/database/database";

/**
 * Fetches all payment modes of type 'bank' from the database.
 */
export function getBanks(): PaymentModeType[] {
  try {
    return db.getAllSync<PaymentModeType>(
      "SELECT * FROM payment_modes WHERE type = 'bank';",
    );
  } catch (error) {
    console.error("Failed to fetch banks from DB:", error);
    return [];
  }
}

export function getBankById(id: string): PaymentModeType | null {
  try {
    return db.getFirstSync<PaymentModeType>(
      `SELECT * FROM payment_modes WHERE id = ${id} AND type = 'bank';`,
    );
  } catch (error) {
    console.error("Failed to fetch bank from DB:", error);
    return null;
  }
}

export function getCash(): number {
  try {
    const result = db.getFirstSync<{ balance: number | null }>(
      "SELECT balance FROM payment_modes WHERE type = 'cash';",
    );
    return result?.balance ?? 0;
  } catch (error) {
    console.error("Failed to fetch cash from DB:", error);
    return 0;
  }
}

/**
 * Fetches all payment modes (both cash and bank) from the database.
 */
export function getPaymentModes(): PaymentModeType[] {
  try {
    return db.getAllSync<PaymentModeType>("SELECT * FROM payment_modes;");
  } catch (error) {
    console.error("Failed to fetch payment modes from DB:", error);
    return [];
  }
}

/**
 * Inserts a new payment mode / account into the database.
 */
export function addAccount(name: string, balance: number): void {
  try {
    db.execSync(
      `INSERT INTO payment_modes (name, type, balance) VALUES ('${name}', 'bank', ${balance});`,
    );
    console.log("Account added successfully:", { name, balance });
  } catch (error) {
    console.error("Failed to add account to DB:", error);
  }
}

export function setCash(balance: number): void {
  try {
    db.runSync("UPDATE payment_modes SET balance = ? WHERE type = 'cash';", [
      balance,
    ]);
    console.log("Cash balance updated successfully:", { balance });
  } catch (error) {
    console.error("Failed to update cash in DB:", error);
    throw error;
  }
}
export function setBankBalance(id: string, balance: number): void {
  try {
    db.runSync(
      "UPDATE payment_modes SET balance = ? WHERE type = 'bank' AND id = ?;",
      [balance, id],
    );
    console.log("Bank balance updated successfully:", { id, balance });
  } catch (error) {
    console.error("Failed to update bank balance in DB:", error);
    throw error;
  }
}

export function updateBankDetails(
  id: string,
  name: string,
  balance: number,
): void {
  try {
    db.runSync(
      "UPDATE payment_modes SET name = ?, balance = ? WHERE type = 'bank' AND id = ?;",
      [name, balance, id],
    );
    console.log("Bank details updated successfully:", { id, name, balance });
  } catch (error) {
    console.error("Failed to update bank details in DB:", error);
    throw error;
  }
}

export function getTotalBalance(): number {
  try {
    const result = db.getFirstSync<{ totalBalance: number | null }>(
      `SELECT SUM(balance) AS totalBalance FROM payment_modes;`,
    );
    return result?.totalBalance ?? 0;
  } catch (error) {
    console.error("Failed to fetch total balance from DB:", error);
    return 0;
  }
}

export function deleteBankAccountById(id: string): void {
  try {
    db.runSync("DELETE FROM payment_modes WHERE type = 'bank' AND id = ?;", [
      id,
    ]);
    console.log("Bank account deleted successfully:", { id });
  } catch (error) {
    console.error("Failed to delete bank account from DB:", error);
    throw error;
  }
}

export function addExpense(params: AddExpenseParams): void {
  const { date, time, amount, note, categoryId, paymentModeId, type } = params;
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const parsedPaymentModeId = parseInt(paymentModeId, 10);
    const trxType = type || "Expense";

    db.withTransactionSync(() => {
      db.runSync(
        "INSERT INTO transactions (date, time, amount, note, category_id, payment_mode_id, type) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [
          formattedDate,
          formattedTime,
          amount,
          note || null,
          categoryId,
          parsedPaymentModeId,
          trxType,
        ],
      );

      if (trxType === "Income") {
        db.runSync(
          "UPDATE payment_modes SET balance = balance + ? WHERE id = ?;",
          [amount, parsedPaymentModeId],
        );
      } else {
        db.runSync(
          "UPDATE payment_modes SET balance = balance - ? WHERE id = ?;",
          [amount, parsedPaymentModeId],
        );
      }
    });

    console.log("Transaction added successfully:", {
      date: formattedDate,
      time: formattedTime,
      amount,
      note,
      categoryId,
      paymentModeId: parsedPaymentModeId,
      type: trxType,
    });
  } catch (error) {
    console.error("Failed to add transaction to DB:", error);
    throw error;
  }
}

export function getAllTransactions(): trxType[] {
  try {
    return db.getAllSync<trxType>(
      "SELECT * FROM transactions ORDER BY date DESC, time DESC, id DESC;",
    );
  } catch (error) {
    console.error("Failed to fetch transactions from DB:", error);
    return [];
  }
}
