const { BrandQueries } = require('../../categories/queries/categories.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllBrands = async (req, res) => {
    try {
        const brands = await BrandQueries.getAllBrands();
        return successResponse(res, brands, 'Brands fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllBrands
};
