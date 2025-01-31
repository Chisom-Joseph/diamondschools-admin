const deleteSubjectSchema = require("../../../validation/subject/delete");
const { Subject } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate subject
    const subjectValid = deleteSubjectSchema.validate(req.body);
    if (subjectValid.error) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: subjectValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
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
        section: "delete",
        message: "Subject does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/subject");
    }

    // Delete subject
    const deletedSubject = await Subject.destroy({
      where: { id: req.body.subject },
    });
    console.log(deletedSubject);

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: "Subject deleted successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/subject");
  } catch (error) {
    console.log(error);
  }
};
