export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation
export const validateEmail = (email: string): ValidationError | null => {
  if (!email) {
    return { field: 'email', message: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' }
  }
  
  return null
}

// Password validation
export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' }
  }
  
  if (password.length < 8) {
    return { field: 'password', message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one number' }
  }

  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one special character (!@#$%^&*)' }
  }

  return null
}

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationError | null => {
  if (!confirmPassword) {
    return { field: 'confirmPassword', message: 'Please confirm your password' }
  }
  
  if (password !== confirmPassword) {
    return { field: 'confirmPassword', message: 'Passwords do not match' }
  }
  
  return null
}

// Name validation
export const validateName = (name: string, fieldName: string = 'name'): ValidationError | null => {
  if (!name) {
    return { field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` }
  }
  
  if (name.length < 2) {
    return { field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters long` }
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} can only contain letters, spaces, hyphens, and apostrophes` }
  }
  
  return null
}

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  const emailError = validateEmail(email)
  if (emailError) errors.push(emailError)
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Signup form validation
export const validateSignupForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  acceptTerms: boolean
): ValidationResult => {
  const errors: ValidationError[] = []
  
  const firstNameError = validateName(firstName, 'firstName')
  if (firstNameError) errors.push(firstNameError)
  
  const lastNameError = validateName(lastName, 'lastName')
  if (lastNameError) errors.push(lastNameError)
  
  const emailError = validateEmail(email)
  if (emailError) errors.push(emailError)
  
  const passwordError = validatePassword(password)
  if (passwordError) errors.push(passwordError)
  
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
  if (confirmPasswordError) errors.push(confirmPasswordError)
  
  if (!acceptTerms) {
    errors.push({ field: 'acceptTerms', message: 'You must accept the Terms of Service and Privacy Policy' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Password reset form validation
export const validatePasswordResetForm = (email: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  const emailError = validateEmail(email)
  if (emailError) errors.push(emailError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// New password form validation
export const validateNewPasswordForm = (password: string, confirmPassword: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  const passwordError = validatePassword(password)
  if (passwordError) errors.push(passwordError)
  
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
  if (confirmPasswordError) errors.push(confirmPasswordError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
