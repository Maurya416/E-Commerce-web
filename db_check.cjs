const pool = require('./backend/config/db');

async function checkDatabase() {
    try {
        const targetTables = ['blogs', 'categories', 'brands', 'products'];
        for (const table of targetTables) {
            try {
                const [columns] = await pool.execute(`DESCRIBE ${table}`);
                console.log(`\nTable: ${table}`);
                console.table(columns.map(c => ({
                    Field: c.Field,
                    Type: c.Type,
                    Null: c.Null,
                    Key: c.Key,
                    Default: c.Default,
                    Extra: c.Extra
                })));
            } catch (e) {
                console.log(`\nTable: ${table} does not exist or error: ${e.message}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDatabase();
