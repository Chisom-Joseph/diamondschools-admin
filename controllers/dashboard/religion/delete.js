const deleteReligionSchema = require("../../../validation/religion/delete");
const { Religion } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate religion
    const religionValid = deleteReligionSchema.validate(req.body);
    if (religionValid.error) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: religionValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/religion");
    }

    // Check if religion exists
    const religionExists = await Religion.findOne({
      where: { id: req.body.religion },
    });
    if (!religionExists) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: "Religion does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/religion");
    }

    // Delete religion
    const deletedReligion = await Religion.destroy({
      where: { id: req.body.religion },
    });
    console.log(deletedReligion);

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: "Religion deleted successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/religion");
  } catch (error) {
    console.log(error);
  }
};
