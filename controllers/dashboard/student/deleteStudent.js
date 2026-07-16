const axios = require("axios");
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

    // Delete student profile image directly from server storage
    if (student.profileImageUrl) {
      const fs = require("fs");
      const path = require("path");
      const os = require("os");
      const filename = path.basename(student.profileImageUrl);
      const filePath = os.platform() === "win32"
        ? path.join(__dirname, "../../../public/assets/img/studentPhotos", filename)
        : path.join("/data/diamondschools_storage/student_photos", filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted profile image: ${filePath}`);
        } catch (err) {
          console.error("Failed to delete profile image:", err);
        }
      }
    }

    // Delete student
    await Student.destroy({ where: { id: studentId } });

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Student ${student.registrationNumber} deleted successfully`,
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
