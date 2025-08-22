const validator = require('validator');

exports.validateEmail = (email) => {
  return validator.isEmail(email);
};

exports.validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      length: password.length < minLength ? `Password must be at least ${minLength} characters` : null,
      uppercase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      lowercase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      number: !hasNumber ? 'Password must contain at least one number' : null,
    },
  };
};

exports.validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

exports.validateMongoId = (id) => {
  return validator.isMongoId(id);
};

exports.validateURL = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });
};

exports.validateProblemDifficulty = (difficulty) => {
  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  return validDifficulties.includes(difficulty);
};

exports.validateProgressStatus = (status) => {
  const validStatuses = ['pending', 'attempted', 'completed', 'revisit'];
  return validStatuses.includes(status);
};