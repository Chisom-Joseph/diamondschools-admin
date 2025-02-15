const academicYear = require("../../../validation/academicYear/update");
const { AcademicYear } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate academic year input
    const academicYearValid = academicYear.validate(req.body);
    if (academicYearValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: academicYearValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "update");
      return res.redirect("/dashboard/academic-year");
    }

    // Add academic year to db
    const updatedAcademicYear = await AcademicYear.update(
      {
        year: req.body.year,
        startDate: req.body.startDAte,
        endDate: req.body.endDAte,
      },
      { where: { id: req.body.academicYears } }
    );
    console.log(updatedAcademicYear);

    req.flash("alert", {
      status: "success",
      section: "update",
      message: `Updated academic year successfully!`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    req.flash("formSection", "update");
    res.redirect("/dashboard/academic-year");
  } catch (error) {
    console.error("ERROR ADDING ACADEMIC YEAR");
    console.error(error);
  }
};
