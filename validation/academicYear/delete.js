const Joi = require("joi");

const getYearsFromAcademicYear = (yearString) => {
  const match = yearString.match(/^(\d{4})\/(\d{4})$/);
  return match
    ? { startYear: parseInt(match[1]), endYear: parseInt(match[2]) }
    : null;
};

const schema = Joi.object({
  academicYear: Joi.string().uuid().required().messages({
    "string.guid": "Invalid Academic Year ID format.",
    "any.required": "Academic Year ID is required.",
  }),
});

module.exports = schema;
