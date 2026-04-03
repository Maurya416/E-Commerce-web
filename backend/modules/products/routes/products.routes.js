const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

router.get('/', productsController.getAllProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/:slug', productsController.getProductBySlug);
router.post('/:id/reviews', productsController.addReview);
router.post('/:id/questions', productsController.addQuestion);
router.put('/questions/:questionId/answer', productsController.answerQuestion);

module.exports = router;
