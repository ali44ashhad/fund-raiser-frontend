export const validateRequired = (value, fieldName = "This field") => {
  if (value === null || value === undefined) return `${fieldName} is required`;
  if (typeof value === "string" && value.trim() === "")
    return `${fieldName} is required`;
  if (Array.isArray(value) && value.length === 0)
    return `${fieldName} is required`;
  return null;
};

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const str = String(email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(str)) {
    return "Please enter a valid email address";
  }
  return null;
};

// Password validation
export const validatePassword = (
  password,
  { minLength = 6, requireMixedCase = true } = {}
) => {
  if (!password && password !== 0) return "Password is required";
  const str = String(password);
  if (str.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  if (requireMixedCase && !/(?=.*[a-z])(?=.*[A-Z])/.test(str)) {
    return "Password must contain both uppercase and lowercase letters";
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword && confirmPassword !== 0)
    return "Please confirm your password";
  if (String(password) !== String(confirmPassword)) {
    return "Passwords do not match";
  }
  return null;
};

// Phone number validation (international friendly basic check)
export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const str = String(phone).trim();
  // allow numbers, spaces, dashes, parentheses, leading +
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
  if (!phoneRegex.test(str)) {
    return "Please enter a valid phone number";
  }
  return null;
};

// Name validation (supports international letters, spaces, hyphens, apostrophes)
export const validateName = (name, fieldName = "Name") => {
  if (!name) return `${fieldName} is required`;
  const str = String(name).trim();
  if (str.length < 2) return `${fieldName} must be at least 2 characters long`;
  // Unicode-aware letter check
  const nameRegex = /^[\p{L}\s\-']+$/u;
  if (!nameRegex.test(str)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
};

// Address validation
export const validateAddress = (address) => {
  if (!address) return "Address is required";
  const str = String(address).trim();
  if (str.length < 10) return "Please enter a complete address";
  return null;
};

// Credit card number validation with Luhn algorithm
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber && cardNumber !== 0) return "Card number is required";
  const str = String(cardNumber).replace(/[\s\-]/g, "");
  if (!/^\d{13,19}$/.test(str)) return "Please enter a valid card number";

  // Luhn check
  let sum = 0;
  let shouldDouble = false;
  for (let i = str.length - 1; i >= 0; i--) {
    let digit = parseInt(str.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) return "Please enter a valid card number";
  return null;
};

// Expiry date validation (accepts MM/YY or MM/YYYY)
export const validateExpiryDate = (expiry) => {
  if (!expiry) return "Expiry date is required";
  const str = String(expiry).trim();
  // Accept MM/YY or MM/YYYY
  const parts = str.split("/");
  if (parts.length !== 2)
    return "Please enter a valid expiry date (MM/YY or MM/YYYY)";

  let [monthStr, yearStr] = parts.map((p) => p.trim());
  if (!/^\d{1,2}$/.test(monthStr)) return "Please enter a valid month (MM)";
  const month = parseInt(monthStr, 10);
  if (month < 1 || month > 12) return "Please enter a valid month (01-12)";

  // Normalize year to 4 digits
  let year = parseInt(yearStr, 10);
  if (yearStr.length === 2) {
    // assume 20xx for 2-digit years (common CC format)
    const currentFullYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentFullYear / 100) * 100;
    year = currentCentury + year;
    // if this yields a year too far in the past (e.g., user typed 90 -> 1990), try next century
    if (year < currentFullYear - 50) year += 100;
  } else if (yearStr.length === 4) {
    // OK
  } else {
    return "Please enter a valid year (YY or YYYY)";
  }

  const now = new Date();
  // Card is valid through the end of the expiry month
  const expiryDate = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
  if (expiryDate < now) return "Card has expired";

  return null;
};

// CVV validation
export const validateCVV = (cvv) => {
  if (!cvv && cvv !== 0) return "CVV is required";
  const str = String(cvv).trim();
  if (!/^\d{3,4}$/.test(str)) return "Please enter a valid CVV (3-4 digits)";
  return null;
};

// Amount validation
export const validateAmount = (amount, min = 1, max = 10000) => {
  if (amount === null || amount === undefined || amount === "")
    return "Amount is required";
  const num = Number(amount);
  if (Number.isNaN(num)) return "Please enter a valid amount";
  if (num < min) return `Amount must be at least ${min}`;
  if (num > max) return `Amount cannot exceed ${max}`;
  return null;
};

// Team selection validation (unique by id or value)
export const validateTeamSelection = (teams, minTeams = 3, maxTeams = 6) => {
  if (!Array.isArray(teams) || teams.length < minTeams) {
    return `Please select at least ${minTeams} teams`;
  }
  if (teams.length > maxTeams) {
    return `You cannot select more than ${maxTeams} teams`;
  }

  const seen = new Set();
  for (const t of teams) {
    const key = (t && (t.id ?? t.value ?? t)) ?? JSON.stringify(t);
    if (seen.has(key)) {
      return "Duplicate teams are not allowed";
    }
    seen.add(key);
  }

  return null;
};

export const validateForm = (formData = {}, validationRules = {}) => {
  const errors = {};

  for (const [field, rules] of Object.entries(validationRules)) {
    if (!Array.isArray(rules)) continue;
    for (const rule of rules) {
      let error = null;
      if (typeof rule === "function") {
        error = rule(formData[field], formData, field);
      } else if (rule && typeof rule.validator === "function") {
        error =
          rule.validator(formData[field], formData, field) ||
          rule.message ||
          null;
      }
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rules
export const validationRules = {
  email: [{ validator: validateEmail }],
  password: [{ validator: validatePassword }],
  name: [
    { validator: (value) => validateRequired(value, "Name") },
    { validator: validateName },
  ],
  phone: [
    { validator: (value) => validateRequired(value, "Phone number") },
    { validator: validatePhone },
  ],
  address: [
    { validator: (value) => validateRequired(value, "Address") },
    { validator: validateAddress },
  ],
};
