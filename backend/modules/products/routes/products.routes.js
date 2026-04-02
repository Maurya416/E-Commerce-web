const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

router.get('/', productsController.getAllProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/:slug', productsController.getProductBySlug);

module.exports = router;
