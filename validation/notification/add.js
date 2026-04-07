const Joi = require("joi");

const schema = Joi.object({
  userType: Joi.string()
    .valid("all-students", "all-aspirants", "all-teachers", "specific-students", "specific-aspirants", "specific-teachers")
    .required()
    .messages({
      "any.only":
        "Recipient type must be All Students, All Aspirants, Specific Students, or Specific Aspirants.",
      "string.base": "Recipient type must be a string.",
      "any.required": "Recipient type is required.",
    }),
  userIds: Joi.when("userType", {
    is: Joi.string().pattern(/^specific-/),
    then: Joi.alternatives()
      .try(Joi.array().items(Joi.string().max(36)).min(1), Joi.string().max(36))
      .required()
      .messages({
        "any.required": "Please select at least one user.",
        "alternatives.types": "Please select at least one user.",
      }),
    otherwise: Joi.any().strip(),
  }),
  title: Joi.string().max(255).required().messages({
    "string.max": "Title must not exceed 255 characters.",
    "string.base": "Title must be a string.",
    "any.required": "Title is required.",
  }),
  message: Joi.string().max(500).required().messages({
    "string.max": "Message must not exceed 500 characters.",
    "string.base": "Message must be a string.",
    "any.required": "Message is required.",
  }),
});

module.exports = schema;
