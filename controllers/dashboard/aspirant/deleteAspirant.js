const axios = require("axios");
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

    // Delete aspirant profile image directly from server storage
    const fs = require("fs");
    const path = require("path");
    const os = require("os");

    if (aspirant.profileImageUrl) {
      const filename = path.basename(aspirant.profileImageUrl);
      const filePath = os.platform() === "win32"
        ? path.join(__dirname, "../../../public/assets/img/studentPhotos", filename)
        : path.join("/data/diamondschools_storage/student_photos", filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted aspirant profile image: ${filePath}`);
        } catch (err) {
          console.error("Failed to delete profile image:", err);
        }
      }
    }

    // Delete aspirant payment proof directly from server storage
    if (aspirant.paymentProofUrl) {
      const filename = path.basename(aspirant.paymentProofUrl);
      const filePath = os.platform() === "win32"
        ? path.join(__dirname, "../../../public/assets/img/paymentProofs", filename)
        : path.join("/data/diamondschools_storage/payment_proofs", filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted aspirant payment proof: ${filePath}`);
        } catch (err) {
          console.error("Failed to delete payment proof:", err);
        }
      }
    }

    // Delete aspirant
    await Aspirant.destroy({ where: { id: aspirantId } });

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Aspirant ${aspirant.examinationNumber} deleted successfully`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    res.redirect("/dashboard/all-aspirants");
  } catch (error) {
    console.error(error);
    console.error("ERROR BLOCKING ASPIRANT");
    req.flash("alert", {
      status: "error",
      section: "block",
      message: "Something went wrong",
    });
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
