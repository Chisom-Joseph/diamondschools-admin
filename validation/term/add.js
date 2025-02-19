const Joi = require("joi");

const schema = Joi.object({
  termName: Joi.string().trim().min(3).max(50).required().label("Term Name"),

  academicYear: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required()
    .label("Academic Year"),

  termStartDate: Joi.date().iso().required().label("Start Date"),

  termEndDate: Joi.date()
    .iso()
    .greater(Joi.ref("termStartDate"))
    .required()
    .label("End Date"),
});

module.exports = schema;
