const addReligionSchema = require("../../../validation/religion/add");
const { Religion } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate religion
    const religionValid = addReligionSchema.validate(req.body);
    if (religionValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: religionValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/religion");
    }

    // Check if religion already exists
    const religionExists = await Religion.findOne({
      where: { name: req.body.religion },
    });
    if (religionExists) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: "Religion already exists.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/religion");
    }

    // Create religion
    const newReligion = await Religion.create({ name: req.body.religion });
    console.log(newReligion);

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Religion added successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/religion");
  } catch (error) {
    console.log(error);
  }
};
