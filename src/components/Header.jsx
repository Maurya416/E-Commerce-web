import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, X, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen((p) => !p)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-violet-700 sm:text-base cursor-pointer"
                    aria-expanded={isUserMenuOpen}
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block">{user.full_name?.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-300 bg-white shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#7e21ff] hover:text-white cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/orders");
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#7e21ff] hover:text-white cursor-pointer"
                      >
                        Order History
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate("/login");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-300 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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