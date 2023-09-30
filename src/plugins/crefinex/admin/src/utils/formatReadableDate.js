export function formatReadableDate(dateTimeString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("en-US", options);
}
