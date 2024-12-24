const Joi = require("joi");

const schema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "First Name is required.",
    "string.min": "First Name must have at least 1 character.",
    "string.max": "First Name must not exceed 50 characters.",
  }),

  middleName: Joi.string().trim().allow("").max(50).messages({
    "string.max": "Middle Name must not exceed 50 characters.",
  }),

  lastName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Last Name is required.",
    "string.min": "Last Name must have at least 1 character.",
    "string.max": "Last Name must not exceed 50 characters.",
  }),

  dateOfBirth: Joi.date().less("now").iso().required().messages({
    "date.base": "Date of Birth must be a valid date.",
    "date.less": "Date of Birth must be in the past.",
    "any.required": "Date of Birth is required.",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),

  class: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Class / Grade is required.",
    "string.min": "Class / Grade must have at least 1 character.",
    "string.max": "Class / Grade must not exceed 50 characters.",
  }),

  gender: Joi.string().trim().min(1).max(15).required().messages({
    "string.empty": "Gender is required.",
    "string.min": "Gender must have at least 1 character.",
    "string.max": "Gender must not exceed 15 characters.",
  }),

  localGovernment: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Local Government is required.",
    "string.min": "Local Government must have at least 1 character.",
    "string.max": "Local Government must not exceed 15 characters.",
  }),

  bloodGroup: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Blood group is required.",
    "string.min": "Blood group must have at least 1 character.",
    "string.max": "Blood group must not exceed 15 characters.",
  }),

  genotype: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Genotype is required.",
    "string.min": "Genotype must have at least 1 character.",
    "string.max": "Genotype must not exceed 15 characters.",
  }),

  // Guardian Information
  guardianFirstName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Guardian's First Name is required.",
    "string.min": "Guardian's First Name must have at least 1 character.",
    "string.max": "Guardian's First Name must not exceed 50 characters.",
  }),

  guardianMiddleName: Joi.string().trim().allow("").max(50).messages({
    "string.max": "Guardian's Middle Name must not exceed 50 characters.",
  }),

  guardianLastName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Guardian's Last Name is required.",
    "string.min": "Guardian's Last Name must have at least 1 character.",
    "string.max": "Guardian's Last Name must not exceed 50 characters.",
  }),

  guardianOcupation: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Ocupation is required.",
    "string.min": "Ocupation must have at least 1 character.",
    "string.max": "Ocupation must not exceed 50 characters.",
  }),

  guardianRelationship: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Guardian's Relationship is required.",
    "string.min": "Guardian's Relationship must have at least 1 character.",
    "string.max": "Guardian's Relationship must not exceed 50 characters.",
  }),

  guardianEmail: Joi.string().email().required().messages({
    "string.empty": "Guardian's Email is required.",
    "string.email": "Guardian's Email must be a valid email address.",
  }),

  guardianPhone: Joi.string()
    .pattern(/^\+?[0-9()]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Guardian's Phone is required.",
      "string.pattern.base":
        "Guardian's Phone must be a valid phone number with 10 to 15 digits.",
    }),

  guardianAddress: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Guardian's Address is required.",
    "string.min": "Guardian's Address must have at least 1 character.",
    "string.max": "Guardian's Address must not exceed 200 characters.",
  }),

  // Address Information
  address: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Address is required.",
    "string.min": "Address must have at least 1 character.",
    "string.max": "Address must not exceed 200 characters.",
  }),

  address2: Joi.string().trim().allow("").max(200).messages({
    "string.max": "Address 2 must not exceed 200 characters.",
  }),

  city: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "City is required.",
    "string.min": "City must have at least 1 character.",
    "string.max": "City must not exceed 50 characters.",
  }),

  state: Joi.string().trim().not("Choose...").required().messages({
    "any.only": "Please select a valid state.",
    "string.empty": "State is required.",
  }),
});

module.exports = schema;
