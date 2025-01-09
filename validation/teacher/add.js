const Joi = require("joi");

const schema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First Name is required.",
    "string.min": "First Name must be at least 3 characters long.",
    "string.max": "First Name cannot exceed 30 characters.",
  }),
  middleName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Middle Name is required.",
    "string.min": "Middle Name must be at least 3 characters long.",
    "string.max": "Middle Name cannot exceed 50 characters.",
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last Name is required.",
    "string.min": "Last Name must be at least 3 characters long.",
    "string.max": "Last Name cannot exceed 30 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "A valid email is required.",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required.",
  }),
  stateOfOrigin: Joi.string().required().messages({
    "string.empty": "State of Origin is required.",
  }),
  religion: Joi.string().required().messages({
    "string.empty": "Religion is required.",
  }),
  gender: Joi.string().required().messages({
    "string.empty": "Gender is required.",
  }),
  address: Joi.string().min(10).max(100).required().messages({
    "string.empty": "Address is required.",
    "string.min": "Address must be at least 10 characters long.",
    "string.max": "Address cannot exceed 100 characters.",
  }),
});

module.exports = schema;
