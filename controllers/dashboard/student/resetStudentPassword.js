const bcrypt = require("bcryptjs");

const { Student } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Generate password
    const password = require("../../../utils/genPassword")(6);

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update student
    const updatedStudent = await Student.update(
      { password: hashedPassword },
      { where: { id: req.params.id } }
    );

    console.log(updatedStudent);

    // Send alert
    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Student password reset successfully`,
    });
    req.flash("form", "");
    req.flash("newPassword", password);
    req.flash("status", 200);
    res.redirect(req.baseUrl + req.path);
  } catch (error) {
    console.error(error);
    console.error("ERROR RESETING STUDENT PASSWORD");
    req.flash("alert", {
      status: "error",
      section: "update",
      message: "Failed to reset student password",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
