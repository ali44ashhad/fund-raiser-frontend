import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContainer from "../components/auth/AuthContainer";
import RegisterForm from "../components/auth/RegisterForm";
import useAuth from "../hooks/useAuth";
// import authAPI from "../services/auth";
// import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Accept only formData
  const handleSubmit = async (formData) => {
    try {
      setError("");
      setLoading(true);

      // register expects an object with name, email, password, phone, address...
      await register(formData);

      // On successful registration, navigate to the dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to create an account. Please check your details and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#FF7F11] hover:text-[#FF1E1E] transition-colors"
          >
            Sign in
          </Link>
        </>
      }
    >
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-[#2a1b18] border border-[#5a2a1a] text-[#FF1E1E] p-3 rounded-md text-center mb-4"
        >
          {error}
        </div>
      )}

      <RegisterForm onSubmit={handleSubmit} loading={loading} />
    </AuthContainer>
  );
};

export default Register;
