const academicYear = require("../../../validation/academicYear/delete");
const { AcademicYear } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate academic year input
    const academicYearValid = academicYear.validate(req.body);
    if (academicYearValid.error) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: academicYearValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "delete");
      return res.redirect("/dashboard/academic-year");
    }

    // Add academic year to db
    const deletedAcademicYear = await AcademicYear.destroy({
      where: { id: req.body.academicYear },
    });
    console.log(deletedAcademicYear);

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: `Deleted academic year successfully!`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    req.flash("formSection", "delete");
    res.redirect("/dashboard/academic-year");
  } catch (error) {
    console.error("ERROR ADDING ACADEMIC YEAR");
    console.error(error);
  }
};
