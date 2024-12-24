const updateClassSchema = require("../../../validation/class/update");
const { Class } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate class
    const classValid = updateClassSchema.validate(req.body);
    if (classValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: classValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/class");
    }

    // Check if class exists
    const classExists = await Class.findOne({
      where: { id: req.body.class },
    });
    if (!classExists) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: "Class does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/class");
    }

    // Update class
    const updatedClass = await Class.update(
      { name: req.body.newClass },
      { where: { id: req.body.class } }
    );
    console.log(updatedClass);

    req.flash("alert", {
      status: "success",
      section: "",
      message: "Class updated successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/class");
  } catch (error) {
    console.log(error);
  }
};
