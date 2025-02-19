const Joi = require("joi");

const schema = Joi.object({
  term: Joi.string().uuid().required().messages({
    "string.guid": "Invalid Academic Year ID format.",
    "any.required": "Academic Year ID is required.",
  }),
});

module.exports = schema;
