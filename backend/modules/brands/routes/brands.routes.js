const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brands.controller');

router.get('/', brandsController.getAllBrands);

module.exports = router;
