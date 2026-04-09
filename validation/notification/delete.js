const Joi = require("joi");

const schema = Joi.object({
  notifications: Joi.alternatives()
    .try(
      Joi.string().min(1).max(36),
      Joi.array().items(Joi.string().min(1).max(36)).min(1)
    )
    .required()
    .messages({
      "alternatives.match": "Select at least one notification to delete.",
      "array.min": "Select at least one notification to delete.",
      "string.empty": "Notification ID cannot be empty.",
      "any.required": "Notification is required.",
    }),
});

module.exports = schema;
