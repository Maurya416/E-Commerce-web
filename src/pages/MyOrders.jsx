import { useEffect, useState } from "react";
import { fetchApi } from "../api/client";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchApi("/api/orders");
                setOrders(data);
            } catch (err) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'shipped': return <Truck className="h-5 w-5 text-blue-500" />;
            case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
            default: return <Package className="h-5 w-5 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b3dff]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Placed</p>
                                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                                        <p className="text-sm font-medium">₹{order.total_amount}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider text-right">Order #</p>
                                    <p className="text-sm font-medium">ORD-{order.id}</p>
                                </div>
                            </div>
                            
                            <div className="px-6 py-6">
                                <div className="flex items-center gap-2 mb-4">
                                    {getStatusIcon(order.status)}
                                    <span className="font-semibold uppercase text-sm tracking-wide">{order.status || 'Processing'}</span>
                                </div>
                                
                                <div className="space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image_url} alt={item.product_name} className="h-full w-full object-contain p-2" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold mt-1">₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
