const addSubjectSchema = require("../../../validation/subject/add");
const { Subject, Sequelize } = require("../../../models");
const { Op } = Sequelize;

module.exports = async (req, res) => {
  try {
    const { subject, shortName, classItem } = req.body;

    // Validate subject
    const subjectValid = addSubjectSchema.validate(req.body);
    if (subjectValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: subjectValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/subject");
    }

    // Check if subject already exists
    const subjectExists = await Subject.findOne({
      where: { [Op.or]: [{ name: req.body.subject }, { shortName }] },
    });
    if (subjectExists) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: "Subject already exists.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/subject");
    }

    // Create subject
    const newSubject = await Subject.create({
      name: subject,
      shortName: shortName,
    });
    console.log(newSubject);

    // Add classes
    if (Array.isArray(classItem)) {
      classItem.forEach((currentClass) => {
        const newClass = newSubject.addClass(currentClass);
        console.log(newClass);
      });
    } else {
      const newClass = newSubject.addClass(classItem);
      console.log(newClass);
    }

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Subject added successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/subject");
  } catch (error) {
    console.log(error);
  }
};
