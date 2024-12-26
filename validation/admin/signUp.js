const Joi = require("joi");

const adminValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First Name is required.",
    "string.min": "First Name must be at least 3 characters long.",
    "string.max": "First Name cannot exceed 30 characters.",
  }),
  middleName: Joi.string().allow("").max(50).messages({
    "string.base": "Middle Name must be a string.",
    "string.max": "Middle Name cannot exceed 50 characters.",
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last Name is required.",
    "string.min": "Last Name must be at least 3 characters long.",
    "string.max": "Last Name cannot exceed 30 characters.",
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username is required.",
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 30 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "A valid email is required.",
  }),
  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 128 characters.",
  }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Password confirmation is required.",
    "any.only": "Passwords must match.",
  }),
});

module.exports = adminValidationSchema;
