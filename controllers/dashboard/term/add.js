const term = require("../../../validation/term/add");
const { Term } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate academic year input
    const termValid = term.validate(req.body);
    if (termValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: termValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "add");
      return res.redirect("/dashboard/term");
    }

    // Add academic year to db
    const newTerm = await Term.create({
      name: req.body.termName,
      startDate: req.body.termStartDate,
      endDate: req.body.termEndDate,
      AcademicYearId: req.body.academicYear,
    });
    console.log(newTerm);

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Added term successfully!`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    req.flash("formSection", "add");
    res.redirect("/dashboard/term");
  } catch (error) {
    console.error("ERROR ADDING TERM");
    console.error(error);
  }
};
