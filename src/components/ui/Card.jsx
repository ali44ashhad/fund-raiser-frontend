const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-charcoal border border-gray-700",
    elevated: "bg-gray-800 shadow-lg",
    outline: "border border-electric-purple",
  };

  return (
    <div
      className={`rounded-xl p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
