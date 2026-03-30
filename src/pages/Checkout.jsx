import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Stethoscope,
  ShoppingBag,
  X,
  CheckCircle2,
  XCircle,
  Wallet,
  Landmark,
  CreditCard,
  BadgeIndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  const [step, setStep] = useState(2);
  const [status, setStatus] = useState("idle");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
  });

  const fakeResult = "success";

  const totalMrp = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.oldPrice || item.price) * item.qty,
      0
    );
  }, [cartItems]);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateAddressStep = () => {
    return (
      formData.fullName.trim() &&
      formData.address1.trim() &&
      formData.pincode.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.email.trim()
    );
  };

  const handleContinueToPayment = () => {
    if (!validateAddressStep()) {
      alert("Please fill all required address details.");
      return;
    }
    setStep(3);
  };

  const handlePayment = () => {
    setStatus("processing");

    setTimeout(() => {
      if (fakeResult === "success") {
        setStatus("success");
        clearCart();
      } else {
        setStatus("failed");
      }
    }, 2000);
  };

  const paymentOptions = [
    {
      key: "upi",
      label: "UPI",
      icon: BadgeIndianRupee,
    },
    {
      key: "card",
      label: "Card/ Card EMI",
      icon: CreditCard,
    },
    {
      key: "wallet",
      label: "Wallets",
      icon: Wallet,
    },
    {
      key: "netbanking",
      label: "Net Banking",
      icon: Landmark,
    },
  ];

  if (status === "success") {
    return (
      <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-4 text-3xl font-semibold text-[#111827]">
              Payment Successful
            </h2>
            <p className="mt-3 text-base text-[#6b7280]">
              Your order has been placed successfully.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] py-3 text-lg font-semibold text-white"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[28px] bg-white p-8 text-center shadow-lg">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-3xl font-semibold text-[#111827]">
              Payment Failed
            </h2>
            <p className="mt-3 text-base text-[#6b7280]">
              Something went wrong while processing your payment.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStatus("idle")}
                className="flex-1 rounded-xl border border-[#8b3dff] py-3 text-base font-semibold text-[#8b3dff]"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] py-3 text-base font-semibold text-white"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-2 lg:px-1">
      <div>
        <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* LEFT SUMMARY */}
          <aside className="border-b border-[#e5e7eb] bg-[#ececec] p-4 lg:border-b-0 lg:border-r lg:p-5 h-155">
            <div className="flex items-center justify-between">
              <h2 className="text-[24px] font-semibold text-[#111827]">
                Order Summary
              </h2>
              <ShoppingBag className="h-6 w-6 text-[#6b7280]" />
            </div>

            <div className="mt-4 bg-[#f8f8f8] p-2">
              <div className="max-h-[330px] space-y-4 overflow-y-auto pr-1 scrollbar-hide">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No items in cart.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg border border-gray-300 px-2 py-2 shadow-md"
                    >
                      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[64px] w-auto object-contain"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <h3 className="text-[16px] leading-6 text-[#111827]">
                          {item.name}
                          {item.size ? ` - ${item.size}` : ""}
                        </h3>

                        <div className="mt-2 flex items-center justify-between text-sm font-bold text-[#111827]">
                          <span>Quantity: {item.qty}</span>
                          <span>Price: ₹{(Number(item.price) * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 bg-[#f8f8f8] p-4">
              <div className="flex items-center font-black justify-between text-md">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between font-black text-md">
                <span>Shipping</span>
                <span>To be calculated</span>
              </div>

              <div className="mt-4 border-t border-[#e5e7eb] pt-3">
                <div className="flex items-center justify-between text-md font-black">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="px-4 py-1">
            {/* TOP BAR */}
            {/* STEP LABELS */}
            <div className="mt-2 flex items-center justify-between text-[16px] text-[#111827] sm:text-[17px]">
              <span className={step >= 1 ? "font-medium" : ""}>1. Contact</span>
              <span className={step >= 2 ? "font-medium" : ""}>2. Address</span>
              <span className={step >= 3 ? "font-medium" : ""}>3. Payment</span>
            </div>

            {/* PROGRESS */}
            <div className="h-1 rounded-full bg-[#dddddd]">
              <div
                className={`h-1 rounded-full bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] transition-all duration-300 ${step === 1 ? "w-1/3" : step === 2 ? "w-1/2" : "w-[92%]"
                  }`}
              />
            </div>

            {/* ADDRESS STEP */}
            {step === 2 && (
              <div className="mt-2">
                <h1 className="text-md font-semibold text-[#111827] md:text-xl">
                  Shipping Address
                </h1>

                <div className="mt-6 space-y-5">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Full Name"
                    className="h-[56px] w-full rounded-lg border border-[#cfcfcf] bg-transparent px-4 text-[17px] text-[#111827] outline-none placeholder:text-[#8b8b8b] focus:border-[#8b3dff]"
                  />

                  <textarea
                    value={formData.address1}
                    onChange={(e) => updateField("address1", e.target.value)}
                    placeholder="Address 1 (House no, Building, Street, Area)"
                    rows={4}
                    className="w-full rounded-lg border border-[#cfcfcf] bg-transparent px-4 py-4 text-[17px] text-[#111827] outline-none placeholder:text-[#8b8b8b] focus:border-[#8b3dff]"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      placeholder="Pincode"
                      className="h-[54px] rounded-lg border border-[#cfcfcf] bg-transparent px-4 text-[17px] text-[#111827] outline-none placeholder:text-[#8b8b8b] focus:border-[#8b3dff]"
                    />

                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                      className="h-[54px] rounded-lg border border-[#cfcfcf] bg-transparent px-4 text-[17px] text-[#111827] outline-none placeholder:text-[#8b8b8b] focus:border-[#8b3dff]"
                    />

                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      placeholder="State"
                      className="h-[54px] rounded-lg border border-[#cfcfcf] bg-transparent px-4 text-[17px] text-[#111827] outline-none placeholder:text-[#8b8b8b] focus:border-[#8b3dff]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[15px] font-medium text-[#111827]">
                      Email
                    </label>

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="Enter email"
                      className={`h-[54px] w-full rounded-lg bg-transparent px-4 text-[17px] text-[#111827] outline-none placeholder:text-[#8b8b8b] transition
      ${formData.email && !isValidEmail(formData.email)
                          ? "border border-red-500 focus:border-red-500"
                          : "border border-[#cfcfcf] focus:border-[#8b3dff]"
                        }`}
                    />

                    {/* ERROR MESSAGE */}
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="mt-1 text-sm text-red-500">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    className="flex h-[58px] w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] text-[18px] font-semibold text-white"
                  >
                    Save & Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <div className="flex items-start justify-between gap-3">
                    <div className="hidden flex-1 items-center justify-between gap-4 sm:flex">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-7 w-7 text-[#111827]" />
                        <p className="text-sm font-semibold leading-4 text-[#111827]">
                          Trusted by 30 lakh+ Customers
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-7 w-7 text-[#111827]" />
                        <p className="text-sm font-semibold leading-4 text-[#111827]">
                          100% Payment Protection
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-7 w-7 text-[#111827]" />
                        <p className="text-sm font-semibold leading-4 text-[#111827]">
                          Recommended by 500+ Dermatologists
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === 3 && (
              <div className="mt-6">
                <h1 className="text-md font-medium text-[#111827] md:text-xl">
                  Select Payment Method
                </h1>

                <div className="mt-2 max-h-[470px] overflow-y-auto rounded-lg border border-[#d9d9d9] bg-white">
                  {paymentOptions.map((method) => {
                    const Icon = method.icon;
                    const isActive = paymentMethod === method.key;

                    return (
                      <button
                        key={method.key}
                        onClick={() => setPaymentMethod(method.key)}
                        className={`grid w-full grid-cols-[1fr_auto] items-center border-b border-[#e5e5e5] px-1 py-3 text-left ${isActive ? "bg-[#dbcaf5]" : "bg-white"
                          }`}
                      >
                        <div className="flex items-center md:gap-2">
                          <div className="flex h-10 w-10 items-center justify-center text-[#2b2b2b]">
                            <Icon className="h-5 w-5 md:h-7 md:w-7 stroke-[1.8]" />
                          </div>

                          <span className="text-md md:text-xl font-normal text-[#111827]">
                            {method.label}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-xs md:text-sm text-[#a3a3a3] line-through">
                              ₹{totalMrp.toFixed(0)}
                            </span>
                            <span className="text-sm md:text-xl font-semibold text-[#111827]">
                              ₹{cartTotal.toFixed(2)}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-col items-end gap-1">
                            <span className="rounded-lg bg-[#34a853] px-1 py-1   text-xs font-semibold text-white">
                              ₹10 Discount
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-[#6b7280]">
                    Secured by payment partner
                  </p>

                  <button
                    onClick={handlePayment}
                    disabled={status === "processing"}
                    className="rounded-lg bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] px-3 py-1   font-normal text-white disabled:opacity-70"
                  >
                    {status === "processing" ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;