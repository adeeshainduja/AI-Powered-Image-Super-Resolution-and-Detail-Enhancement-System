import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../api/authApi";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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

    console.log("Sign in data:", formData);

    // Backend API connection comes next
    alert("Sign in button working!");
  };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
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
              Upscale and enhance your photos with AI
            </h1>

            <p className="mb-8 text-lg leading-8 text-slate-600">
              Improve image clarity, sharpness, and detail in seconds using
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

            <div className="relative max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-indigo-100">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                alt="AI photo enhancement preview"
                className="h-72 w-full object-cover"
              />

              <div className="absolute inset-0 flex">
                <div className="flex w-1/2 items-start justify-start border-r-2 border-white/80 p-4 backdrop-blur-[1px]">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white">
                    BEFORE
                  </span>
                </div>

                <div className="flex w-1/2 items-start justify-end p-4">
                  <span className="rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-bold text-white">
                    AFTER AI
                  </span>
                </div>

                <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-indigo-600 bg-white text-lg text-indigo-600 shadow-lg">
                  ↔
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-slate-600">
                Sign in to continue enhancing your photos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

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

              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />

                <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99]"
              >
                Sign In →
              </button>
            </form>

            <p className="mt-8 text-center text-slate-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-indigo-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}