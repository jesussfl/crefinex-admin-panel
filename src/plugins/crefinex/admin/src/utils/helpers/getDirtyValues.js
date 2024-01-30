export function getDirtyValues(dirtyFields, values) {
  const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
    // Unsure when RFH sets this to `false`, but omit the field if so.
    if (!dirtyFields[key]) return prev;

    return {
      ...prev,
      [key]: typeof dirtyFields[key] === "object" ? getDirtyValues(dirtyFields[key], values[key]) : values[key],
    };
  }, {});

  return dirtyValues;
}
