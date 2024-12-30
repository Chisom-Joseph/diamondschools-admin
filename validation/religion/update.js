const Joi = require("joi");

const schema = Joi.object({
  religion: Joi.string().min(1).max(36).required().messages({
    "string.empty": "Input a religion name to continue.",
    "string.min": "Religion must be at least 1 characters long.",
    "string.max": "Religion cannot exceed 30 characters.",
  }),
  newReligion: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Input a new religion name to continue.",
    "string.min": "New Religion name must be at least 1 characters long.",
    "string.max": "New Religion name cannot exceed 30 characters.",
  }),
});

module.exports = schema;
