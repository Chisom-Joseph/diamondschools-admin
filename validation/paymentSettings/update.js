const Joi = require("joi");

const schema = Joi.object({
  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),

  amount: Joi.string().trim().required().messages({
    "string.empty": "Amount is required.",
    "any.required": "Amount is required.",
  }),

  accountNumber: Joi.string().trim().required().messages({
    "string.empty": "Account number is required.",
    "any.required": "Account number is required.",
  }),

  accountName: Joi.string().trim().required().messages({
    "string.empty": "Account name is required.",
    "any.required": "Account name is required.",
  }),

  bankName: Joi.string().trim().required().messages({
    "string.empty": "Bank name is required.",
    "any.required": "Bank name is required.",
  }),

  accountType: Joi.string().trim().required().messages({
    "string.empty": "Account type is required.",
    "any.required": "Account type is required.",
  }),
});

module.exports = schema;
