const OrderQueries = require('../queries/orders.queries');
const { CartQueries } = require('../../cart/queries/cart.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await CartQueries.getCartByUserId(userId);

        if (cartItems.length === 0) {
            return errorResponse(res, 'Cart is empty', 400);
        }

        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const orderId = await OrderQueries.createOrder(userId, totalAmount, cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        })));

        // Clear cart after successful order
        await CartQueries.clearCart(userId);

        return successResponse(res, { orderId }, 'Order placed successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await OrderQueries.getUserOrders(userId);
        return successResponse(res, orders, 'Orders fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    placeOrder,
    getUserOrders
};
