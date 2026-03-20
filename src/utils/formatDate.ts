export function formatDate(
  dateStr: string | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!dateStr) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(dateStr));
}

export function formatYear(dateStr: string | undefined): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).getFullYear().toString();
}
