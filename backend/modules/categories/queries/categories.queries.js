const pool = require('../../../config/db');

const CategoryQueries = {
    getAllCategories: async () => {
        const [rows] = await pool.execute('SELECT * FROM categories');
        return rows;
    }
};

const BrandQueries = {
    getAllBrands: async () => {
        const [rows] = await pool.execute('SELECT * FROM brands');
        return rows;
    }
};

module.exports = {
    CategoryQueries,
    BrandQueries
};
