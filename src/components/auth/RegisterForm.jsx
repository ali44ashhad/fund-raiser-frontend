// src/components/auth/RegisterForm.jsx
import { useState } from "react";

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      // optional extra check — matches your earlier validator
      newErrors.password =
        "Password must contain both uppercase and lowercase letters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.address || !formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      acceptTerms: !!formData.acceptTerms,
    };

    if (typeof onSubmit === "function") {
      onSubmit(payload);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full px-4 py-3 bg-[#0B1D13] border ${
              errors.name ? "border-red-600" : "border-[#2A2A2A]"
            } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-colors`}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-[#FF1E1E]">
              {errors.name}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
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
            className={`w-full px-4 py-3 bg-[#0B1D13] border ${
              errors.email ? "border-red-600" : "border-[#2A2A2A]"
            } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-colors`}
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-[#FF1E1E]">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full px-4 py-3 bg-[#0B1D13] border ${
              errors.password ? "border-red-600" : "border-[#2A2A2A]"
            } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-colors`}
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-[#FF1E1E]">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            className={`w-full px-4 py-3 bg-[#0B1D13] border ${
              errors.confirmPassword ? "border-red-600" : "border-[#2A2A2A]"
            } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-colors`}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="mt-1 text-sm text-[#FF1E1E]"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`w-full px-4 py-3 bg-[#0B1D13] border ${
              errors.phone ? "border-red-600" : "border-[#2A2A2A]"
            } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-colors`}
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-[#FF1E1E]">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            required
            aria-invalid={errors.address ? "true" : "false"}
            aria-describedby={errors.address ? "address-error" : undefined}
            className={`w-full px-4 py-3 bg-[#0B1D13] border ${
              errors.address ? "border-red-600" : "border-[#2A2A2A]"
            } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-colors`}
            placeholder="Your full address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <p id="address-error" className="mt-1 text-sm text-[#FF1E1E]">
              {errors.address}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={handleChange}
                aria-invalid={errors.acceptTerms ? "true" : "false"}
                className="focus:ring-[#FF7F11] h-4 w-4 text-[#4B5320] border-gray-600 rounded bg-[#0B1D13]"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="acceptTerms"
                className="font-medium text-gray-400"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#FF7F11] hover:text-[#FF1E1E] transition-colors"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#FF7F11] hover:text-[#FF1E1E] transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-[#FF1E1E]">
                  {errors.acceptTerms}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4B5320] hover:bg-[#FF7F11] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F11] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center">
              Create Account
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
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

export default RegisterForm;
