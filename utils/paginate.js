/**
 * Pagination utility
 * @param {Object} model - Mongoose model to query
 * @param {Object} query - MongoDB filter query
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of items per page
 * @param {Object} sort - Sort options, e.g. { timestamp: -1 }
 * @returns {Object} - paginated result { total, page, pages, data }
 */
const paginate = async (model, query = {}, page = 1, limit = 20, sort = { timestamp: -1 }) => {
  page = parseInt(page);
  limit = parseInt(limit);

  const skip = (page - 1) * limit;

  // Total documents matching the query
  const total = await model.countDocuments(query);

  // Fetch paginated data
  const data = await model
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean() // returns plain JS objects instead of Mongoose documents
    .exec();

  // Total pages
  const pages = Math.ceil(total / limit);

  return {
    total,
    page,
    pages,
    data,
  };
};

module.exports = paginate;
