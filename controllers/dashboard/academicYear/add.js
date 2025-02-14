const academicYear = require("../../../validation/academicYear/add");
const { AcademicYear } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate academic year input
    const academicYearValid = academicYear.validate(req.body);
    if (academicYearValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: academicYearValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "add");
      return res.redirect("/dashboard/academic-year");
    }

    // Add academic year to db
    const newAcademicYear = await AcademicYear.create(req.body);
    console.log(newAcademicYear);

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Added academic year successfully!`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    req.flash("formSection", "add");
    res.redirect("/dashboard/academic-year");
  } catch (error) {
    console.error("ERROR ADDING ACADEMIC YEAR");
    console.error(error);
  }
};
