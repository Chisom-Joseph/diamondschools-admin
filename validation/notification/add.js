const Joi = require("joi");

const schema = Joi.object({
  users: Joi.string()
    .valid("student", "aspirant", "teacher", "admin")
    .required()
    .messages({
      "any.only": "User must be either student, teacher, or admin.",
      "string.base": "User must be a string.",
      "any.required": "User is required.",
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
