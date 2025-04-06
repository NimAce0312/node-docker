export const processPaginationQuery = (query) => {
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  return {
    limit,
    page,
    skip,
  };
};

export const processPaginationParams = (page, limit, totalCount) => {
  const totalPage = Math.ceil(totalCount / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPage;

  return {
    totalPage,
    totalCount,
    hasPreviousPage,
    hasNextPage,
  };
};
