const { Student } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const studentId = req.params.id || req.body.studentId;
    const student = await Student.findOne({ where: { id: studentId } });

    if (!student) {
      req.flash("alert", {
        status: "error",
        section: "block",
        message: "Student not found",
      });
      req.flash("status", 404);
      return res.redirect(req.baseUrl + req.path);
    }

    const newBlockedStatus = !student.blocked; // Toggle status

    await Student.update(
      { blocked: newBlockedStatus },
      { where: { id: studentId } }
    );

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Student ${
        req.body.studentId ? student.registrationNumber : ""
      } ${newBlockedStatus ? "blocked" : "unblocked"} successfully`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    res.redirect(req.baseUrl + req.path);
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
