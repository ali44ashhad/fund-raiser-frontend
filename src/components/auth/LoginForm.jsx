// src/components/auth/LoginForm.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // clear field error when user types
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email || formData.email.trim() === "") {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email";
    }

    if (!formData.password || formData.password.trim() === "") {
      errs.password = "Password is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Call parent with only the form data
    if (typeof onSubmit === "function") {
      onSubmit({
        email: formData.email.trim(),
        password: formData.password,
        remember: !!formData.remember,
      });
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`relative block w-full rounded-t-md rounded-b-none focus:z-10 bg-[#0B1D13] border ${
              errors.email ? "border-red-600" : "border-[#2A2A2A]"
            } text-white placeholder-gray-400 focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11] px-3 py-2`}
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`relative block w-full rounded-b-md rounded-t-none focus:z-10 bg-[#0B1D13] border ${
              errors.password ? "border-red-600" : "border-[#2A2A2A]"
            } text-white placeholder-gray-400 focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11] px-3 py-2`}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-400">
              {errors.password}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-[#FF7F11] focus:ring-[#FF7F11] border-[#2A2A2A] rounded bg-[#0B1D13]"
            aria-checked={formData.remember}
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-400 select-none"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-[#FF1E1E] hover:text-[#FF7F11] transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4B5320] hover:bg-[#FF7F11] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F11] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center">
              Sign in
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
