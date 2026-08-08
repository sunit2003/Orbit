export const TRANSACTION_COLORS = {
  Expense: "#52B3AD", // Vibrant Soft Rose/Crimson
  Income: "#FF8C00", // Emerald Green
  Transfer: "#0095B6", // Royal Blue
} as const;

export type TransactionType = keyof typeof TRANSACTION_COLORS;
