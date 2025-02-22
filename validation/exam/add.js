const Joi = require("joi");

const schema = Joi.object({
  subject: Joi.string().uuid().required().messages({
    "string.empty": "Subject is required.",
    "string.guid": "Subject must be a valid UUID.",
  }),
  class: Joi.string().uuid().required().messages({
    "string.empty": "Class is required.",
    "string.guid": "Class must be a valid UUID.",
  }),
  term: Joi.string().uuid().required().messages({
    "string.empty": "Term is required.",
    "string.guid": "Term must be a valid UUID.",
  }),
  updateFor: Joi.string()
    .valid("all", "student", "aspirant")
    .required()
    .messages({
      "string.empty": "updateFor is required.",
      "any.only": "updateFor must be either 'aspirant' 'studen' or 'all'.",
    }),
  question: Joi.string().min(3).required().messages({
    "string.empty": "Question is required.",
    "string.min": "Question must be at least 3 characters long.",
  }),
  option1: Joi.string().min(3).required().messages({
    "string.empty": "Option 1 is required.",
    "string.min": "Option 1 must be at least 3 characters long.",
  }),
  option2: Joi.string().min(3).required().messages({
    "string.empty": "Option 2 is required.",
    "string.min": "Option 2 must be at least 3 characters long.",
  }),
  option3: Joi.string().min(3).required().messages({
    "string.empty": "Option 3 is required.",
    "string.min": "Option 3 must be at least 3 characters long.",
  }),
  option4: Joi.string().min(3).required().messages({
    "string.empty": "Option 4 is required.",
    "string.min": "Option 4 must be at least 3 characters long.",
  }),
  correctOption: Joi.string()
    .valid("option1", "option2", "option3", "option4")
    .required()
    .messages({
      "string.empty": "Correct option is required.",
      "any.only":
        "Correct option must be one of: option1, option2, option3, or option4.",
    }),
});
module.exports = schema;
