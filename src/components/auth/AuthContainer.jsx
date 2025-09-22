// src/components/auth/AuthContainer.jsx
import { motion } from "framer-motion";

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const AuthContainer = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D13] px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-xl w-full space-y-8 bg-[#0B1D13] p-8 sm:p-10 rounded-2xl shadow-lg border border-[#2A2A2A]"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#4B5320] rounded-full flex items-center justify-center">
            <LockIcon />
          </div>
          <h2
            className="mt-6 text-3xl font-extrabold text-[#FF7F11] tracking-tight"
            aria-label={title}
          >
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-gray-400">{subtitle}</p>}
        </div>

        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthContainer;
