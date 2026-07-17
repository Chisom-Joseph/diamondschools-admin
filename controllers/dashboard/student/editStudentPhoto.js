const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sutdentProfileImageUpload = require("../../../middlewares/studentProfileImageUpload");
const { Student } = require("../../../models");

module.exports = async (req, res) => {
  try {
    sutdentProfileImageUpload(req, res, async (err) => {
      // Handle profile image errors
      if (err instanceof multer.MulterError) {
        if ((err.code = "LIMIT_FILE_SIZE")) {
          req.flash("alert", {
            status: "error",
            message: "File size too large. Maximum file size is 2MB",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect(req.baseUrl + req.path);
        } else if (err) {
          req.flash("alert", {
            status: "error",
            message: "Failed to upload file",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect(req.baseUrl + req.path);
        }
      }

      // Check if photo was uploaded
      if (!req.file) {
        req.flash("alert", {
          status: "error",
          message: "Profile photo is required",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect(req.baseUrl + req.path);
      }
      const cleanupFile = () => {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkErr) {
            console.error("Failed to delete temp file:", unlinkErr);
          }
        }
      };

      const studentId = req.params.id || req.body.studentId;

      //   Get current profile image
      const student = await Student.findByPk(studentId);

      if (!student) {
        cleanupFile();
        req.flash("alert", {
          status: "error",
          section: "block",
          message: "Student not found",
        });
        req.flash("status", 404);
        return res.redirect(req.baseUrl + req.path);
      }

      const profileImageUrl = `https://files.diamondschools.com.ng/student_photos/${req.file.filename}`;

      try {
        // Delete previous profile photo if it exists
        if (student.profileImageUrl) {
          const oldFilename = path.basename(student.profileImageUrl);
          const os = require("os");
          const oldPath = os.platform() === "win32"
            ? path.join(__dirname, "../../../public/assets/img/studentPhotos", oldFilename)
            : path.join("/data/diamondschools_storage/student_photos", oldFilename);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
              console.log(`Deleted old file: ${oldPath}`);
            } catch (err) {
              console.error("Failed to delete old file:", err);
            }
          }
        }

        // Update student
        const editedStudent = await Student.update(
          {
            profileImageUrl,
          },
          { where: { id: studentId } }
        );
        console.log(editedStudent);

        // Send alert
        req.flash("alert", {
          status: "success",
          section: "add",
          message: `Student ${
            req.body.studentId ? student.registrationNumber : ""
          } updated successfully`,
        });
        req.flash("form", "");
        req.flash("status", 200);
        return res.redirect(req.baseUrl + req.path);
      } catch (dbError) {
        cleanupFile();
        throw dbError;
      }
    });
  } catch (error) {
    console.error(error);
    console.error("ERROR ADDING STUDENT");
    req.flash("alert", {
      status: "error",
      section: "add",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
