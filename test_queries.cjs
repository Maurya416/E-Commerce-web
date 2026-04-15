
const DashboardQueries = require('./backend/modules/dashboard/queries/dashboard.queries');

async function testQueries() {
    try {
        console.log('Testing getStats...');
        const stats = await DashboardQueries.getStats();
        console.log('Stats:', stats);

        console.log('\nTesting getRecentOrders...');
        const recentOrders = await DashboardQueries.getRecentOrders();
        console.log('Recent Orders count:', recentOrders.length);
        if (recentOrders.length > 0) {
            console.log('First order sample:', recentOrders[0]);
        }

        console.log('\nTesting getTopProducts...');
        const topProducts = await DashboardQueries.getTopProducts();
        console.log('Top Products count:', topProducts.length);
        if (topProducts.length > 0) {
            console.log('First product sample:', topProducts[0]);
        }

    } catch (err) {
        console.error('ERROR during query test:', err.message);
        if (err.sqlState) console.error('SQL State:', err.sqlState);
        if (err.code) console.error('Error Code:', err.code);
    } finally {
        process.exit();
    }
}

testQueries();
