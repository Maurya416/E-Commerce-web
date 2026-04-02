const pool = require('../../../config/db');

const OrderQueries = {
    createOrder: async (userId, totalAmount, items) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
                [userId, totalAmount]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
            }

            // Create history entry
            await connection.execute(
                'INSERT INTO order_history (user_id, order_id, action, details) VALUES (?, ?, ?, ?)',
                [userId, orderId, 'purchased', `Ordered ${items.length} items for ₹${totalAmount}`]
            );

            await connection.commit();
            return orderId;
        } catch (err) {
            if (connection) await connection.rollback();
            throw err;
        } finally {
            if (connection) connection.release();
        }
    },

    getUserOrders: async (userId) => {
        const [orders] = await pool.execute(`
            SELECT o.*, 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'product_name', p.name,
                        'image_url', pi.image_url
                    )
                ) as items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [userId]);
        return orders;
    }
};

module.exports = OrderQueries;
