const HomeQueries = require('../queries/home.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getHome = async (req, res) => {
    try {
        const data = await HomeQueries.getHomePayload();
        return successResponse(res, data, 'Home data fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getCollectionProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const collectionProducts = await HomeQueries.getCollectionProducts(category);
        const features = await HomeQueries.getFeatures();
        return successResponse(
            res,
            { collectionProducts, features },
            'Collection page data fetched successfully'
        );
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getHome,
    getCollectionProducts,
};
