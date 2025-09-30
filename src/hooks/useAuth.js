import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextContext";

// Updated to use new AuthContext export
export const useAuth = () => {
  // No need to check for context, React will warn if missing
  return useContext(AuthContext);
};

export default useAuth;
