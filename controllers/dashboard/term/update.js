const term = require("../../../validation/term/update");
const { Term } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate academic year input
    const termValid = term.validate(req.body);
    if (termValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: termValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "update");
      return res.redirect("/dashboard/term");
    }

    // Add academic year to db
    const updatedTerm = await Term.update(
      {
        name: req.body.updateTermName,
        startDate: req.body.updateStartDate,
        endDate: req.body.updateEndDate,
        AcademicYearId: req.body.updateAcademicYears,
      },
      { where: { id: req.body.updateTerm } }
    );
    console.log(updatedTerm);

    req.flash("alert", {
      status: "success",
      section: "update",
      message: `Updated academic year successfully!`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    req.flash("formSection", "update");
    res.redirect("/dashboard/term");
  } catch (error) {
    console.error("ERROR UPDATING TERM");
    console.error(error);
  }
};
