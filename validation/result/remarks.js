const Joi = require("joi");

const schema = Joi.object({
  generalRemark: Joi.string().min(1).max(500).required().messages({
    "string.base": "General remark must be a string.",
    "string.empty": "General remark cannot be empty.",
    "string.min": "General remark must have at least 1 character.",
    "string.max": "General remark cannot exceed 500 characters.",
    "any.required": "General remark is required.",
  }),

  teacherRemark: Joi.string().min(1).max(500).required().messages({
    "string.base": "Teacher remark must be a string.",
    "string.empty": "Teacher remark cannot be empty.",
    "string.min": "Teacher remark must have at least 1 character.",
    "string.max": "Teacher remark cannot exceed 500 characters.",
    "any.required": "Teacher remark is required.",
  }),

  form: Joi.allow(),
});

module.exports = schema;
