const deleteClassSchema = require("../../../validation/class/delete");
const { Class } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate class
    const classValid = deleteClassSchema.validate(req.body);
    if (classValid.error) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: classValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
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
        section: "delete",
        message: "Class does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/class");
    }

    // Delete class
    const deletedClass = await Class.destroy({
      where: { id: req.body.class },
    });
    console.log(deletedClass);

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: "Class deleted successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/class");
  } catch (error) {
    console.log(error);
  }
};
