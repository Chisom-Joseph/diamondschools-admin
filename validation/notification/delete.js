const Joi = require("joi");

const schema = Joi.object({
  notification: Joi.string().min(1).max(36).required().messages({
    "string.empty": "Select a notification to delete.",
    "string.min": "Notification ID is invalid.",
    "string.max": "Notification ID cannot exceed 36 characters.",
    "any.required": "Notification is required.",
  }),
});

module.exports = schema;
