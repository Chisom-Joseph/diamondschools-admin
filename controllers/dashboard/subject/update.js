const updateSubjectSchema = require("../../../validation/subject/update");
const { Subject } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate subject
    const subjectValid = updateSubjectSchema.validate(req.body);
    if (subjectValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: subjectValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/subject");
    }

    // Check if subject exists
    const subjectExists = await Subject.findOne({
      where: { id: req.body.subject },
    });
    if (!subjectExists) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: "Subject does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/subject");
    }

    // Update subject
    const updatedSubject = await Subject.update(
      {
        name: req.body.subjectName,
        shortName: req.body.shortName,
        ClassId: req.body.classItem,
      },
      { where: { id: req.body.subject } }
    );
    console.log(updatedSubject);

    req.flash("alert", {
      status: "success",
      section: "update",
      message: "Subject updated successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/subject");
  } catch (error) {
    console.log(error);
  }
};
