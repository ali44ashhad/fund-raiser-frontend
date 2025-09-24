const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-charcoal border border-gray-700",
    elevated: "bg-gray-800 shadow-lg",
    outline: "border border-electric-purple",
  };

  return (
    <div
      className={`relative rounded-xl p-6 ${variants[variant]} ${className}`}
      style={{ pointerEvents: "auto" }} // ensures buttons inside are clickable
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
