import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-full mt-10 mb-10 bg-[#f6f7fb] flex items-center justify-center px-4">
      {/* CARD */}
      <div className="w-full max-w-md rounded-lg bg-white px-3 py-4 shadow-lg ">
        {/* LOGO */}
        <div className="flex justify-center mb-2">
          <img
            src="/src/assets/images/icons/Clinikally_LOGO_for_Website_240x.webp"
            alt="Clinikally"
            className="h-10 object-contain"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold text-[#111827]">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Login to continue your skincare journey
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#8b3dff] focus:ring-2 focus:ring-[#e9ddff]"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:border-[#8b3dff] focus:ring-2 focus:ring-[#e9ddff]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* FORGOT */}
          <div className="text-right">
            <button type="button" className="text-sm font-medium text-[#8b3dff] hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] py-3 text-white font-semibold hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button type="button" className="w-full rounded-lg border border-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-50 transition">
            Continue with Google
          </button>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-medium text-[#8b3dff] hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;