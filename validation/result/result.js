const Joi = require("joi");

const schema = Joi.object({
  firstTest: Joi.number().min(0).max(100).required().messages({
    "number.base": "First test score must be a number",
    "number.min": "First test score cannot be less than 0",
    "number.max": "First test score cannot be more than 100",
    "any.required": "First test score is required",
  }),

  presentation: Joi.number().min(0).max(100).required().messages({
    "number.base": "Presentation score must be a number",
    "number.min": "Presentation score cannot be less than 0",
    "number.max": "Presentation score cannot be more than 100",
    "any.required": "Presentation score is required",
  }),

  midTermTest: Joi.number().min(0).max(100).required().messages({
    "number.base": "Mid-term test score must be a number",
    "number.min": "Mid-term test score cannot be less than 0",
    "number.max": "Mid-term test score cannot be more than 100",
    "any.required": "Mid-term test score is required",
  }),

  project: Joi.number().min(0).max(100).required().messages({
    "number.base": "Project score must be a number",
    "number.min": "Project score cannot be less than 0",
    "number.max": "Project score cannot be more than 100",
    "any.required": "Project score is required",
  }),

  note: Joi.number().min(0).max(100).required().messages({
    "number.base": "Note score must be a number",
    "number.min": "Note score cannot be less than 0",
    "number.max": "Note score cannot be more than 100",
    "any.required": "Note score is required",
  }),

  examScore: Joi.number().min(0).max(100).required().messages({
    "number.base": "Exam score must be a number",
    "number.min": "Exam score cannot be less than 0",
    "number.max": "Exam score cannot be more than 100",
    "any.required": "Exam score is required",
  }),

  totalScore: Joi.number().min(0).max(100).required().messages({
    "number.base": "Total score must be a number",
    "number.min": "Total score cannot be less than 0",
    "number.max": "Total score cannot be more than 100",
    "any.required": "Total score is required",
  }),

  grade: Joi.string().valid("A", "B", "C", "D", "E", "F").required().messages({
    "any.only": "Grade must be one of A, B, C, D, E, or F",
    "any.required": "Grade is required",
  }),

  remark: Joi.string().required().messages({
    "string.base": "Remark must be a text",
    "any.required": "Remark is required",
  }),

  subject: Joi.string().uuid().required().messages({
    "string.base": "Subject ID must be a valid string",
    "string.guid": "Invalid subject ID format",
    "any.required": "Subject ID is required",
  }),

  form: Joi.allow(),
});

module.exports = schema;
