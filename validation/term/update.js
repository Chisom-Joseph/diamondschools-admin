const Joi = require("joi");

const schema = Joi.object({
  updateTerm: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required()
    .label("Term")
    .messages({
      "string.empty": "Term ID is required.",
      "string.guid": "Invalid Term ID format. Must be a valid UUID.",
    }),

  updateTermName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .label("Term Name")
    .messages({
      "string.empty": "Term Name is required.",
      "string.min": "Term Name must be at least 3 characters long.",
      "string.max": "Term Name must be at most 100 characters long.",
    }),

  updateAcademicYears: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required()
    .label("Academic Year")
    .messages({
      "string.empty": "Academic Year ID is required.",
      "string.guid": "Invalid Academic Year ID format. Must be a valid UUID.",
    }),

  updateStartDate: Joi.date().iso().required().label("Start Date").messages({
    "date.base": "Start Date must be a valid date.",
    "date.format": "Start Date must be in ISO format (YYYY-MM-DD).",
    "any.required": "Start Date is required.",
  }),

  updateEndDate: Joi.date()
    .iso()
    .greater(Joi.ref("updateStartDate"))
    .required()
    .label("End Date")
    .messages({
      "date.base": "End Date must be a valid date.",
      "date.format": "End Date must be in ISO format (YYYY-MM-DD).",
      "any.required": "End Date is required.",
      "date.greater": "End Date must be later than Start Date.",
    }),
});

module.exports = schema;
