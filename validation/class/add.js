const Joi = require("joi");

const schema = Joi.object({
  class: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Input a class name to continue.",
    "string.min": "Class must be at least 1 characters long.",
    "string.max": "Class cannot exceed 30 characters.",
  }),
});

module.exports = schema;
