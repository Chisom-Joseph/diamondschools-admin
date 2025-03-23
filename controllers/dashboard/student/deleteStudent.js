const { Student } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id } });

    if (!student) {
      req.flash("alert", {
        status: "error",
        section: "block",
        message: "Student not found",
      });
      req.flash("status", 404);
      return res.redirect(req.baseUrl + req.path);
    }

    await Student.destroy({ where: { id: req.params.id } });

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Student deleted successfully`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    res.redirect("/dashboard/all-students");
  } catch (error) {
    console.error(error);
    console.error("ERROR BLOCKING STUDENT");
    req.flash("alert", {
      status: "error",
      section: "block",
      message: "Something went wrong",
    });
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
