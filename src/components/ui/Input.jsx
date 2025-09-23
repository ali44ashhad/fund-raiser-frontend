import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${
            error
              ? "border-neon-pink focus:ring-neon-pink focus:border-neon-pink"
              : ""
          } ${className}`}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error ? "text-neon-pink" : "text-gray-400"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
