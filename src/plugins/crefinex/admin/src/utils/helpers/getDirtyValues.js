export function getDirtyValues(dirtyFields, values) {
  const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
    if (!dirtyFields[key]) return prev;

    if (Array.isArray(values[key])) {
      // Filter out elements with name equal to false before creating a new array with unique elements
      const uniqueValues = Array.from(new Set([...values[key]]));

      return {
        ...prev,
        [key]: uniqueValues,
      };
    } else if (typeof dirtyFields[key] === "object") {
      // If it's an object, recursively call getDirtyValues
      return {
        ...prev,
        [key]: getDirtyValues(dirtyFields[key], values[key]),
      };
    } else {
      // Otherwise, just take the value
      return {
        ...prev,
        [key]: values[key],
      };
    }
  }, {});

  return dirtyValues;
}
