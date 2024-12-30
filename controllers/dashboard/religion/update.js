const updateReligionSchema = require("../../../validation/religion/update");
const { Religion } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate religion
    const religionValid = updateReligionSchema.validate(req.body);
    if (religionValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: religionValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
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
        section: "update",
        message: "Religion does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/religion");
    }

    // Update religion
    const updatedReligion = await Religion.update(
      { name: req.body.newReligion },
      { where: { id: req.body.religion } }
    );
    console.log(updatedReligion);

    req.flash("alert", {
      status: "success",
      section: "update",
      message: "Religion updated successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/religion");
  } catch (error) {
    console.log(error);
  }
};
