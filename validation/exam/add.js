const Joi = require("joi");

const schema = Joi.object({
  subject: Joi.string().uuid().required().messages({
    "string.base": "Subject must be a valid UUID string.",
    "string.empty": "Subject is required.",
    "string.guid": "Subject must be a valid UUID.",
    "any.required": "Subject is required.",
  }),

  question: Joi.string().min(3).max(500).required().messages({
    "string.base": "Question must be a valid string.",
    "string.empty": "Question is required.",
    "string.min": "Question must be at least {#limit} characters long.",
    "string.max": "Question must not exceed {#limit} characters.",
    "any.required": "Question is required.",
  }),

  questionImage: Joi.object({
    originalname: Joi.string().required().messages({
      "string.base": "Image name must be a valid string.",
      "string.empty": "Image name is required.",
      "any.required": "Image name is required.",
    }),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/webp")
      .required()
      .messages({
        "string.base": "File type must be a valid string.",
        "any.only": "Only JPEG, PNG, GIF, and WEBP image formats are allowed.",
        "any.required": "Image file type is required.",
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024) // 5MB limit
      .messages({
        "number.base": "Image size must be a number.",
        "number.max": "Image size must not exceed 5MB.",
      }),
  })
    .optional()
    .messages({
      "object.base": "Question image must be a valid file.",
    }),

  option1: Joi.string().min(1).max(255).required().messages({
    "string.base": "Option 1 must be a valid string.",
    "string.empty": "Option 1 is required.",
    "string.min": "Option 1 must contain at least {#limit} character.",
    "string.max": "Option 1 must not exceed {#limit} characters.",
    "any.required": "Option 1 is required.",
  }),

  option2: Joi.string().min(1).max(255).required().messages({
    "string.base": "Option 2 must be a valid string.",
    "string.empty": "Option 2 is required.",
    "string.min": "Option 2 must contain at least {#limit} character.",
    "string.max": "Option 2 must not exceed {#limit} characters.",
    "any.required": "Option 2 is required.",
  }),

  option3: Joi.string().min(1).max(255).required().messages({
    "string.base": "Option 3 must be a valid string.",
    "string.empty": "Option 3 is required.",
    "string.min": "Option 3 must contain at least {#limit} character.",
    "string.max": "Option 3 must not exceed {#limit} characters.",
    "any.required": "Option 3 is required.",
  }),

  option4: Joi.string().min(1).max(255).required().messages({
    "string.base": "Option 4 must be a valid string.",
    "string.empty": "Option 4 is required.",
    "string.min": "Option 4 must contain at least {#limit} character.",
    "string.max": "Option 4 must not exceed {#limit} characters.",
    "any.required": "Option 4 is required.",
  }),

  correctOption: Joi.string()
    .valid("option1", "option2", "option3", "option4")
    .required()
    .messages({
      "string.base": "Correct option must be a valid string.",
      "string.empty": "Correct option is required.",
      "any.only":
        "Correct option must be one of 'option1', 'option2', 'option3', or 'option4'.",
      "any.required": "Correct option is required.",
    }),
});

module.exports = schema;
