import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setIsSubmitting(true);
      await signup(fullName, email, password);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 mb-10 flex min-h-full items-center justify-center bg-[#f6f7fb] px-4">
      {/* CARD */}
      <div className="w-full max-w-md rounded-lg bg-white px-3 py-4 shadow-lg">
        {/* LOGO */}
        <div className="mb-2 flex justify-center">
          <img
            src="/src/assets/images/icons/Clinikally_LOGO_for_Website_240x.webp"
            alt="Clinikally"
            className="h-10 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold text-[#111827]">
          Create Account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Sign up to start your skincare journey
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* FULL NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#8b3dff] focus:ring-2 focus:ring-[#e9ddff]"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
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
                placeholder="Create your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:border-[#8b3dff] focus:ring-2 focus:ring-[#e9ddff]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:border-[#8b3dff] focus:ring-2 focus:ring-[#e9ddff]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* SIGNUP BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-[#8b3dff] to-[#6d28d9] py-3 font-semibold text-white transition hover:opacity-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>

          {/* GOOGLE SIGNUP */}
          <button type="button" className="w-full rounded-lg border border-gray-300 py-2 font-medium text-gray-700 transition hover:bg-gray-50">
            Continue with Google
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-[#8b3dff] hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;