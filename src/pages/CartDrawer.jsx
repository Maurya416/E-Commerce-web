import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";


function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseCartQty,
    decreaseCartQty,
    removeFromCart,
  } = useCart();

  const totalMrp = cartItems.reduce(
    (total, item) =>
      total + (item.oldPrice || item.price) * item.qty,
    0
  );

  const savedAmount = totalMrp - cartTotal;
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#f6f7fb] px-4 py-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="px-5 md:py-0 text-center text-xl font-normal md:text-2xl">
          MY CART
        </div>

  
        {/* FREE SHIPPING */}
        <div className="mt-2 px-4 text-center text-md font-bold text-slate-900">
          CONGRATS! You get FREE SHIPPING 🎉
        </div>

        {/* MAIN GRID */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* LEFT - ITEMS */}
          <div className="bg-[#f5f6f7] px-4 sm:px-6">

            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-lg text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-1 px-2 border border-gray-300 shadow-md rounded-lg">

                    {/* IMAGE */}
                    <div className="flex h-24 w-24 items-center justify-center bg-slate-50 rounded-lg">
                      <img
                        src={item.image}
                        className="h-20 object-contain"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col justify-between">

                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.name}
                          </h3>
                          {item.size && ( 
                            <p className="text-sm text-slate-500">
                              {item.size}
                            </p>
                          )}
                        </div>

                        <button onClick={() => removeFromCart(item.cartId)}>
                          <Trash2 className="text-gray-400 hover:text-red-300 h-4 md:h-5 cursor-pointer"/>
                        </button>
                      </div>

                      {/* QTY */}
                      <div className="mt-1 flex items-center justify-between">

                        <div className="flex bg-gray-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => decreaseCartQty(item.id)}
                            className="px-1 py-1"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-1">{item.qty}</span>

                          <button
                            onClick={() => increaseCartQty(item.id)}
                            className="px-1 py-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right">
                          <p className="text-green-600 font-semibold">
                            ₹{item.price * item.qty}
                          </p>

                          {item.oldPrice && (
                            <p className="line-through text-gray-400 text-sm">
                              ₹{item.oldPrice * item.qty}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - SUMMARY (same design) */}
          {cartItems.length > 0 && (
            <div className="h-fit bg-[#f3edf7] px-4 py-5 sm:px-6 sticky top-6 rounded-lg">

              {/* SAVE BOX */}
              <div className="rounded-2xl bg-green-50 px-4 py-4 text-center text-lg font-medium text-slate-900">
                🪙 Wow! Saved ₹{savedAmount} on your order
              </div>

              {/* SUBTOTAL */}
              <div className="mt-5 flex justify-between text-lg font-normal">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>

              {/* MRP */}
              {totalMrp > cartTotal && (
                <div className="flex justify-between text-gray-400 line-through mt-1">
                  <span>MRP</span>
                  <span>₹{totalMrp}</span>
                </div>
              )}

              {/* CHECKOUT */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-lg bg-gradient-to-r cursor-pointer from-violet-500 to-violet-700 py-3 text-lg font-normal text-white">
                🔒 SECURE CHECKOUT
              </button>

              {/* TERMS */}
              <p className="mt-4 text-center text-sm text-slate-600">
                By Signing In, I agree to{" "}
                <span className="text-violet-600 underline">
                  Term & Conditions
                </span>{" "}
                and{" "}
                <span className="text-violet-600 underline">
                  Privacy Policy
                </span>
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Cart;