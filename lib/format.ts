/**
 * Formats a numeric amount in PKR standard currency representation: e.g. 231,988/-
 *
 * @param amount Number representing PKR amount
 * @returns Formatted currency string
 */
export function money(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0/-";
  }
  const formatted = Math.round(amount).toLocaleString("en-US");
  return `${formatted}/-`;
}
