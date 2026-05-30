import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../api/authApi";

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await signUpUser(formData.name, formData.email, formData.password);

      alert("Account created successfully!");
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Side */}
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f9ff] to-[#e6eeff] px-6 py-12 lg:px-16">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <Link
              to="/"
              className="mb-4 inline-block text-2xl font-bold text-indigo-600"
            >
              Enhance Photo Scale
            </Link>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Create your account and enhance photos with AI
            </h1>

            <p className="mb-8 text-lg leading-8 text-slate-600">
              Upscale, sharpen, and improve image quality in seconds using
              AI-powered super resolution.
            </p>

            <div className="mb-10 flex flex-wrap gap-3">
              {[
                "1x to 5x Upscale",
                "Detail Enhancement",
                "Sharpness Control",
                "Fast AI Processing",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-indigo-100">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    AI Enhancement
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Ready to upscale
                  </h3>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  FAST
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((scale) => (
                  <div
                    key={scale}
                    className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-4 text-center"
                  >
                    <p className="text-lg font-bold text-indigo-700">
                      {scale}x
                    </p>
                    <p className="text-xs text-slate-500">Scale</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center bg-white px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Create Account
              </h2>
              <p className="mt-2 text-slate-600">
                Start enhancing your photos today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-14 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-14 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />

                <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Sign Up →"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm font-semibold text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-bold text-indigo-600">
                G
              </span>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-slate-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-bold text-indigo-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}