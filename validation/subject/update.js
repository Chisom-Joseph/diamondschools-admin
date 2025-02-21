const Joi = require("joi");

const schema = Joi.object({
  subject: Joi.string().min(1).max(36).required().messages({
    "string.empty": "Input a subject name to continue.",
    "string.min": "Religion must be at least 1 characters long.",
    "string.max": "Religion cannot exceed 30 characters.",
  }),
  subjectName: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Input a new subject name to continue.",
    "string.min": "New subject name must be at least 1 characters long.",
    "string.max": "New subject name cannot exceed 30 characters.",
  }),
  shortName: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Input a new short name to continue.",
    "string.min": "New short name must be at least 1 characters long.",
    "string.max": "New short name cannot exceed 30 characters.",
  }),
  classItem: Joi.alternatives()
    .try(Joi.string().min(1), Joi.array().items(Joi.string().min(1)))
    .required()
    .messages({
      "string.empty": "Input a Short name to continue.",
      "string.min": "Class name must be at least 1 character long.",
      "array.base": "Class name must be a string or an array of strings.",
      "array.includes":
        "Each class name in the array must be at least 1 character long.",
    }),
});

module.exports = schema;
