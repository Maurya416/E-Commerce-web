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

const addReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviewData = req.body;
        
        if (!reviewData.rating || !reviewData.name || !reviewData.comment) {
            return errorResponse(res, 'Missing required review fields', 400);
        }

        const insertId = await ProductQueries.addReview(productId, reviewData);
        return successResponse(res, { id: insertId }, 'Review submitted successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addQuestion = async (req, res) => {
    try {
        const productId = req.params.id;
        const questionData = req.body;

        if (!questionData.name || !questionData.question) {
            return errorResponse(res, 'Missing required question fields', 400);
        }

        const insertId = await ProductQueries.addQuestion(productId, questionData);
        return successResponse(res, { id: insertId }, 'Question submitted successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const answerQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const { answer } = req.body;

        if (!answer) {
            return errorResponse(res, 'Answer is required', 400);
        }

        const updated = await ProductQueries.answerQuestion(questionId, answer);
        if (!updated) {
            return errorResponse(res, 'Question not found', 404);
        }

        return successResponse(res, null, 'Question answered successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllProducts,
    getProductBySlug,
    getFeaturedProducts,
    addReview,
    addQuestion,
    answerQuestion
};
