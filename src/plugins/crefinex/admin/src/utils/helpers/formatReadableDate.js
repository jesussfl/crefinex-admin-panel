export function formatReadableDate(dateTimeString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("en-US", options);
}
