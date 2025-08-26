export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
  return passwordRegex.test(password);
};

export const validateName = (name) => {
  return name && name.trim().length >= 20 && name.trim().length <= 60;
};

export const validateAddress = (address) => {
  return address && address.trim().length >= 1 && address.trim().length <= 400;
};

export const validateRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

// Form validation functions
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  } else if (!validateName(formData.name)) {
    errors.name = 'Name must be between 20-60 characters';
  }

  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Address validation
  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  } else if (!validateAddress(formData.address)) {
    errors.address = 'Address must be maximum 400 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUserForm = (formData) => {
  const errors = {};

  if (!validateName(formData.name)) {
    errors.name = 'Name must be between 20-60 characters';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (formData.password && !validatePassword(formData.password)) {
    errors.password = 'Password must be 8-16 characters with uppercase and special character';
  }

  if (!validateAddress(formData.address)) {
    errors.address = 'Address is required (max 400 characters)';
  }

  if (!['admin', 'user', 'store_owner'].includes(formData.role)) {
    errors.role = 'Please select a valid role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStoreForm = (formData) => {
  const errors = {};

  if (!validateName(formData.name)) {
    errors.name = 'Store name must be between 20-60 characters';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateAddress(formData.address)) {
    errors.address = 'Address is required (max 400 characters)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRatingForm = (formData) => {
  const errors = {};

  if (!validateRating(formData.rating)) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  if (formData.comment && formData.comment.length > 1000) {
    errors.comment = 'Comment must be maximum 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitization functions
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' '); // Remove extra whitespace
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  return email.toLowerCase().trim();
};

export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'string') {
      if (key === 'email') {
        sanitized[key] = sanitizeEmail(formData[key]);
      } else {
        sanitized[key] = sanitizeString(formData[key]);
      }
    } else {
      sanitized[key] = formData[key];
    }
  });
  
  return sanitized;
};