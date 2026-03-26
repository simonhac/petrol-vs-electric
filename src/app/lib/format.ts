/** Returns e.g. "26 March 2026" in Melbourne time */
export function melbourneDate(): string {
  return new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  });
}
