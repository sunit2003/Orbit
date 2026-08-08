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
    integerPart = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }

  return (isNegative ? "-" : "") + integerPart + decimalPart;
}
