const updateSubjectSchema = require("../../../validation/subject/update");
const { Subject, Class, ClassSubject } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { subjectName, shortName, classItem, subject } = req.body;
    // return res.json(req.body);

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
      where: { id: subject },
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
    await Subject.update(
      {
        name: subjectName,
        shortName: shortName,
      },
      { where: { id: subject } }
    );

    const updatedSubject = await Subject.findByPk(subject);

    if (!updatedSubject) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: "Subject not added",
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/subject");
    }

    // Delete old class associations
    await ClassSubject.destroy({
      where: { SubjectId: subject }, // Use SubjectId, not id
    });

    // Update classes
    if (Array.isArray(classItem)) {
      await updatedSubject.addClasses(classItem); // Use addClasses for bulk
    } else {
      await updatedSubject.addClass(classItem); // Use addClass for a single class
    }

    req.flash("alert", {
      status: "success",
      section: "update",
      message: "Subject updated successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "update");
    req.flash("status", 200);
    res.redirect("/dashboard/subject");
  } catch (error) {
    console.log(error);
  }
};
