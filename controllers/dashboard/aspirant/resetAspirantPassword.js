const bcrypt = require("bcryptjs");

const { Aspirant } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const aspirantId = req.params.id || req.body.aspirantId;
    const aspirant = await Aspirant.findOne({ where: { id: aspirantId } });

    if (!aspirant) {
      req.flash("alert", {
        status: "error",
        section: "block",
        message: "Aspirant not found",
      });
      req.flash("status", 404);
      return res.redirect(req.baseUrl + req.path);
    }

    // Generate password
    const password = require("../../../utils/genPassword")(6);

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update aspirant
    const updatedAspirant = await Aspirant.update(
      { password: hashedPassword },
      { where: { id: aspirantId } }
    );

    console.log(updatedAspirant);

    // Send alert
    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Aspirant ${
        req.body.aspirantId ? aspirant.examinationNumber : ""
      } password reset successfully`,
    });
    req.flash("form", "");
    req.flash("newPassword", password);
    req.flash("newPasswordFor", aspirant.examinationNumber);
    req.flash("status", 200);
    res.redirect(req.baseUrl + req.path);
  } catch (error) {
    console.error(error);
    console.error("ERROR RESETING ASPIRANT PASSWORD");
    req.flash("alert", {
      status: "error",
      section: "update",
      message: "Failed to reset aspirant password",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
