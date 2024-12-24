const addClassSchema = require("../../../validation/class/add");
const { Class } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate class
    const classValid = addClassSchema.validate(req.body);
    if (classValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: classValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/class");
    }

    // Check if class already exists
    const classExists = await Class.findOne({
      where: { name: req.body.class },
    });
    if (classExists) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: "Class already exists.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/class");
    }

    // Create class
    const newClass = await Class.create({ name: req.body.class });
    console.log(newClass);

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Class added successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/class");
  } catch (error) {
    console.log(error);
  }
};
