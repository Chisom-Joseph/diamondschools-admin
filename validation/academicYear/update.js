const Joi = require("joi");

const getYearsFromAcademicYear = (yearString) => {
  const match = yearString.match(/^(\d{4})\/(\d{4})$/);
  return match
    ? { startYear: parseInt(match[1]), endYear: parseInt(match[2]) }
    : null;
};

const schema = Joi.object({
  academicYears: Joi.string().uuid().required().messages({
    "string.guid": "Invalid Academic Year ID format.",
    "any.required": "Academic Year ID is required.",
  }),

  year: Joi.string()
    .pattern(/^\d{4}\/\d{4}$/)
    .custom((value, helpers) => {
      const years = getYearsFromAcademicYear(value);
      if (!years) {
        return helpers.message(
          "Academic Year must be in format YYYY/YYYY (e.g., 2023/2024)."
        );
      }
      if (years.endYear !== years.startYear + 1) {
        return helpers.message(
          "Academic Year must be consecutive (e.g., 2023/2024)."
        );
      }
      return value;
    })
    .required()
    .messages({
      "string.pattern.base":
        "Academic Year must be in format YYYY/YYYY (e.g., 2023/2024).",
      "any.required": "Academic Year is required.",
    }),

  startDate: Joi.date()
    .required()
    .custom((value, helpers) => {
      const { startYear } = getYearsFromAcademicYear(
        helpers.state.ancestors[0].year
      );
      const startDate = new Date(value);
      if (startDate.getFullYear() !== startYear) {
        return helpers.message(
          `Start Date must be within the academic year (${startYear}).`
        );
      }
      return value;
    })
    .messages({
      "any.required": "Start Date is required.",
      "date.base": "Start Date must be a valid date.",
    }),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required()
    .custom((value, helpers) => {
      const { endYear } = getYearsFromAcademicYear(
        helpers.state.ancestors[0].year
      );
      const endDate = new Date(value);
      if (endDate.getFullYear() !== endYear) {
        return helpers.message(
          `End Date must be within the academic year (${endYear}).`
        );
      }
      return value;
    })
    .messages({
      "any.required": "End Date is required.",
      "date.greater": "End Date must be after Start Date.",
      "date.base": "End Date must be a valid date.",
    }),
});

module.exports = schema;
