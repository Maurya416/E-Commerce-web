const ProductQueries = require('../queries/products.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllProducts = async (req, res) => {
    try {
        const filters = {
            category_id: req.query.category_id,
            brand_id: req.query.brand_id,
            condition: req.query.condition,
            is_doctor_choice: req.query.is_doctor_choice
        };
        const products = await ProductQueries.getAllProducts(filters);
        return successResponse(res, products, 'Products fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await ProductQueries.getProductBySlug(slug);
        
        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, product, 'Product detail fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await ProductQueries.getFeaturedProducts(req.query.limit || 10);
        return successResponse(res, products, 'Featured products fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllProducts,
    getProductBySlug,
    getFeaturedProducts
};
