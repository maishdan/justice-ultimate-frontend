// src/lib/utils.ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
export function formatDate(date: Date, format: string): string {
  const options: Intl.DateTimeFormatOptions = {};
  if (format.includes("year")) options.year = "numeric";
  if (format.includes("month")) options.month = "short";
  if (format.includes("day")) options.day = "numeric";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
export function formatTime(date: Date, format: string): string {
  const options: Intl.DateTimeFormatOptions = {};
  if (format.includes("hour")) options.hour = "2-digit";
  if (format.includes("minute")) options.minute = "2-digit";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
export function isValidPhoneNumber(phone: string): boolean {
  const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return re.test(phone);
}
export function debounce(func: Function, delay: number): (...args: any[]) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}