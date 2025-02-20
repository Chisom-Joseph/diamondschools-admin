const addSubjectSchema = require("../../../validation/subject/add");
const { Subject } = require("../../../models");

module.exports = async (req, res) => {
  try {
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
      where: { name: req.body.subject, ClassId: req.body.classItem },
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
      name: req.body.subject,
      shortName: req.body.shortName,
      ClassId: req.body.classItem,
    });
    console.log(newSubject);

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
