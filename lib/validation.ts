export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateAmount = (amount: string, min = 0, max = Infinity): { valid: boolean; error?: string } => {
  const num = parseFloat(amount);

  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid amount' };
  }

  if (num < min) {
    return { valid: false, error: `Minimum amount is ${min}` };
  }

  if (num > max) {
    return { valid: false, error: `Maximum amount is ${max}` };
  }

  return { valid: true };
};

export const validateWalletAddress = (address: string): boolean => {
  const hexRegex = /^0x[a-fA-F0-9]{40}$/;
  return hexRegex.test(address);
};

export const validateForm = (
  data: Record<string, string>,
  rules: Record<string, (value: string) => { valid: boolean; error?: string }>
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field] || '');
    if (!result.valid && result.error) {
      errors[field] = result.error;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
