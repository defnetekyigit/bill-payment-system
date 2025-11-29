export const paginate = <T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; page: number; limit: number } => {
  const total = items.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    total,
    page,
    limit,
  };
};
