type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
};

type IOptionsResult = {
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  //pagination
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;

  const skip = (page - 1) * limit;

  //sorting
  const sortBy: string = options.sortBy || "createAt";
  const sortOrder: string = options.sortOrder || "desc";

  return {
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
