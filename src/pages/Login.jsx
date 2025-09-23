import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContainer from "../components/auth/AuthContainer";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Accept only formData (LoginForm already prevented default)
  const handleSubmit = async (formData) => {
    try {
      setError("");
      setLoading(true);

      // normal user login (isAdmin = false)
      await login(formData.email, formData.password, false);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to log in. Please check your credentials and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Sign in to your account"
      subtitle={
        <>
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-[#FF7F11] hover:text-[#FF1E1E] transition-colors"
          >
            create a new account
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

      <LoginForm onSubmit={handleSubmit} loading={loading} />

      <div className="text-center mt-4">
        <Link
          to="/admin/login"
          className="font-medium text-[#A78BFA] hover:text-[#FF7F11] transition-colors"
        >
          Admin Login
        </Link>
      </div>
    </AuthContainer>
  );
};

export default Login;
