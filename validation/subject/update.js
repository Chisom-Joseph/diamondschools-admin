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
  classItem: Joi.string().min(1).required().messages({
    "string.empty": "Select a new class to continue.",
    "string.min": "New class must be at least 1 characters long.",
  }),
});

module.exports = schema;
