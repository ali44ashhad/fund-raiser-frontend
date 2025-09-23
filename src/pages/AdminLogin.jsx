import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContainer from "../components/auth/AuthContainer";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";

const AdminLogin = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Accept only formData
  const handleSubmit = async (formData) => {
    try {
      setError("");
      setLoading(true);

      // Pass isAdmin flag to differentiate admin login
      await login(formData.email, formData.password, true);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
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
      title="Admin Sign In"
      subtitle={
        <>
          Regular user?{" "}
          <Link
            to="/login"
            className="font-medium text-[#FF7F11] hover:text-[#FF1E1E] transition-colors"
          >
            User Login
          </Link>
        </>
      }
    >
      {error && (
        <div
          className="bg-[#2a1b18] border border-[#5a2a1a] text-[#FF1E1E] p-3 rounded-md text-center mb-4"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </AuthContainer>
  );
};

export default AdminLogin;
