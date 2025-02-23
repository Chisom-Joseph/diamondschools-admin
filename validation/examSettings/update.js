const Joi = require("joi");

const schema = Joi.object({
  duration: Joi.number().integer().positive().required().messages({
    "number.base": "Duration must be a number.",
    "number.integer": "Duration must be an integer.",
    "number.positive": "Duration must be a positive number.",
    "any.required": "Duration is required.",
  }),

  questionLimit: Joi.number().integer().positive().required().messages({
    "number.base": "Question limit must be a number.",
    "number.integer": "Question limit must be an integer.",
    "number.positive": "Question limit must be a positive number.",
    "any.required": "Question limit is required.",
  }),

  shuffleQuestions: Joi.string().valid("yes", "no").required().messages({
    "any.only": 'Shuffle questions must be either "Yes" or "No".',
    "any.required": "Shuffle questions is required.",
  }),

  shuffleOptions: Joi.string().valid("yes", "no").required().messages({
    "any.only": 'Shuffle options must be either "Yes" or "No".',
    "any.required": "Shuffle options is required.",
  }),

  markPerQuestion: Joi.number().integer().positive().required().messages({
    "number.base": "Mark per question must be a number.",
    "number.integer": "Mark per question must be an integer.",
    "number.positive": "Mark per question must be a positive number.",
    "any.required": "Mark per question is required.",
  }),

  startDate: Joi.date().iso().required().messages({
    "date.base": "Start date must be a valid date.",
    "date.format": "Start date must be in ISO format (YYYY-MM-DD).",
    "any.required": "Start date is required.",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.base": "End date must be a valid date.",
    "date.format": "End date must be in ISO format (YYYY-MM-DD).",
    "date.min": "End date must be after or equal to the start date.",
    "any.required": "End date is required.",
  }),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "any.required": "Start time is required",
      "string.pattern.base": "Start time must be in HH:mm format",
    }),
});
module.exports = schema;
