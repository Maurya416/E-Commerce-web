const pool = require('./backend/config/db');
const { CategoryQueries, BrandQueries } = require('./backend/modules/categories/queries/categories.queries');

async function testAdd() {
    try {
        console.log('Testing Category Add...');
        try {
            const catId = await CategoryQueries.createCategory({
                title: 'Test Category ' + Date.now(),
                image: 'https://placehold.co/100x100',
                color: '#ff0000',
                description: 'Test description'
            });
            console.log('✅ Category added successfully, ID:', catId);
        } catch (e) {
            console.error('❌ Category add failed:', e.message);
        }

        console.log('\nTesting Brand Add...');
        try {
            const brandId = await BrandQueries.createBrand({
                name: 'Test Brand ' + Date.now(),
                image: 'https://placehold.co/100x100',
                active: true,
                featured: true
            });
            console.log('✅ Brand added successfully, ID:', brandId);
        } catch (e) {
            console.error('❌ Brand add failed:', e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

testAdd();
