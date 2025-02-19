const term = require("../../../validation/term/delete");
const { Term } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate term input
    const termValid = term.validate(req.body);
    if (termValid.error) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: termValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "delete");
      return res.redirect("/dashboard/term");
    }

    // Add term to db
    const deletedTerm = await Term.destroy({
      where: { id: req.body.term },
    });
    console.log(deletedTerm);

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: `Deleted term successfully!`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    req.flash("formSection", "delete");
    res.redirect("/dashboard/term");
  } catch (error) {
    console.error("ERROR DELETING TERM");
    console.error(error);
  }
};
