const { CategoryQueries } = require('../queries/categories.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryQueries.getAllCategories();
        return successResponse(res, categories, 'Categories fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllCategories
};
