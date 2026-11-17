/**
 * Formats a number or string representing a number into the Indian Rupee (INR) numbering system.
 * Example: "10234.45" -> "10,234.45"
 * Example: 1234567.89 -> "12,34,567.89"
 */
export function formatToINR(value: string | number): string {
  if (value === undefined || value === null) return "";
  let str = typeof value === "number" ? value.toString() : value.trim();
  if (!str) return "";

  // Handle negative sign
  const isNegative = str.startsWith("-");
  if (isNegative) {
    str = str.substring(1);
  }

  // Split integer and decimal parts
  const parts = str.split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Format integer part based on Indian system (last 3 digits grouped, then groups of 2 digits)
  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherParts = integerPart.substring(0, integerPart.length - 3);
  if (otherParts !== "") {
    integerPart =
      otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }

  return (isNegative ? "-" : "") + integerPart + decimalPart;
}

/**
 * Formats a number or string representing a number into the Indian Rupee (INR) numbering system
 * prepended with the currency symbol '₹'. For negative amounts, formats as '-₹XX,XX,XXX.XX'.
 */
export function formatToINRWithSymbol(value: string | number): string {
  if (value === undefined || value === null) return "";
  let str = typeof value === "number" ? value.toString() : value.trim();
  if (!str) return "";

  const isNegative = str.startsWith("-");
  if (isNegative) {
    str = str.substring(1);
  }

  const formattedValue = formatToINR(str);
  return (isNegative ? "-₹" : "₹") + formattedValue;
}

export function isNegativeAmount(value: string | number): boolean {
  if (value === undefined || value === null) return false;
  let str = typeof value === "number" ? value.toString() : value.trim();
  if (!str) return false;

  const isNegative = str.startsWith("-");
  if (isNegative) {
    return true;
  }
  return false;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats a transaction date and time into:
 * - "Today, hh:mm"
 * - "Yesterday, hh:mm"
 * - "dd-MMM-yyyy, hh:mm"
 */
export function formatTransactionDateTime(
  dateInput: string | Date,
  timeInput?: string | Date,
): string {
  let targetYear: number;
  let targetMonth: number; // 0-indexed
  let targetDay: number;

  if (dateInput instanceof Date) {
    targetYear = dateInput.getFullYear();
    targetMonth = dateInput.getMonth();
    targetDay = dateInput.getDate();
  } else {
    // Expected format: YYYY-MM-DD or standard ISO date string
    const parts = dateInput.split("T")[0].split("-");
    if (parts.length === 3) {
      targetYear = parseInt(parts[0], 10);
      targetMonth = parseInt(parts[1], 10) - 1;
      targetDay = parseInt(parts[2], 10);
    } else {
      const d = new Date(dateInput);
      targetYear = d.getFullYear();
      targetMonth = d.getMonth();
      targetDay = d.getDate();
    }
  }

  // Format time (hh:mm)
  let formattedTime = "";
  if (timeInput instanceof Date) {
    const hours = timeInput.getHours().toString().padStart(2, "0");
    const minutes = timeInput.getMinutes().toString().padStart(2, "0");
    formattedTime = `${hours}:${minutes}`;
  } else if (typeof timeInput === "string" && timeInput.trim()) {
    // If format is HH:mm:ss or HH:mm
    const timeParts = timeInput.trim().split(":");
    if (timeParts.length >= 2) {
      formattedTime = `${timeParts[0].padStart(2, "0")}:${timeParts[1].padStart(2, "0")}`;
    } else {
      formattedTime = timeInput;
    }
  }

  // Calculate Today and Yesterday in local midnight comparison
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetMidnight = new Date(targetYear, targetMonth, targetDay);

  const diffTime = today.getTime() - targetMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let datePrefix = "";
  if (diffDays === 0) {
    datePrefix = "Today";
  } else if (diffDays === 1) {
    datePrefix = "Yesterday";
  } else {
    const dayStr = targetDay.toString().padStart(2, "0");
    const monthStr = MONTH_NAMES[targetMonth] || "";
    datePrefix = `${dayStr}-${monthStr}-${targetYear}`;
  }

  return formattedTime ? `${datePrefix}, ${formattedTime}` : datePrefix;
}
