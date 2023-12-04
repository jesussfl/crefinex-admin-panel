export const formatData = (data) => {
  if (!data) {
    return [];
  }

  return data.map((section) => {
    return {
      id: section.id,
      ...section.attributes,
    };
  });
};
