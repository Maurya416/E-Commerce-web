import { useState } from "react";
import { Search, ShoppingCart, User, X, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/src/assets/images/icons/Clinikally_LOGO_for_Website_240x.webp"
              alt="Clinikally"
              onClick={() => navigate("/")}
              className="h-12 w-auto object-contain pb-1 cursor-pointer"
            />
          </div>

          {/* Desktop Search */}
          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full rounded-full border border-slate-300 bg-[#f9fafb] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="md:hidden"
            >
              {isMobileSearchOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Search className="h-6 w-6 text-slate-700" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-violet-700 sm:text-base cursor-pointer"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user.full_name?.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 sm:text-base cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-violet-700 sm:text-base cursor-pointer"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block">Login</span>
              </button>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-violet-700 sm:text-base cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:block">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMobileSearchOpen
              ? "max-h-24 pt-4 opacity-100"
              : "max-h-0 pt-0 opacity-0"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full rounded-full border border-slate-300 bg-[#f9fafb] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;