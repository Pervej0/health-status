export const pick = <T extends Record<string, unknown>, f extends keyof T>(
  query: T,
  fields: f[]
): Partial<T> => {
  const selectedQuery: Partial<T> = {};
  for (const field of fields) {
    if (
      Object.keys(query).length > 0 &&
      Object.hasOwnProperty.call(query, field)
    ) {
      selectedQuery[field] = query[field];
    }
  }
  return selectedQuery;
};
