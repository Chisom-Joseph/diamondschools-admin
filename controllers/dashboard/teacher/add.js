const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { Country } = require("country-state-city");
const addTeacherSchema = require("../../../validation/teacher/add");
const sutdentProfileImageUpload = require("../../../middlewares/teacherProfileImageUpload");
const { Teacher, Guardian, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  try {
    sutdentProfileImageUpload(req, res, async (err) => {
      // Helper function to clean up uploaded file
      const cleanupFile = () => {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkErr) {
            console.error("Failed to delete temp file:", unlinkErr);
          }
        }
      };

      // Handle profile image errors
      if (err instanceof multer.MulterError) {
        if ((err.code = "LIMIT_FILE_SIZE")) {
          req.flash("alert", {
            status: "error",
            message: "File size too large. Maximum file size is 2MB",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/dashboard/add-teacher");
        } else if (err) {
          req.flash("alert", {
            status: "error",
            message: "Failed to upload file",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/dashboard/add-teacher");
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
        return res.redirect("/dashboard/add-teacher");
      }

      // Validate teacher
      const teacherValid = addTeacherSchema.validate(req.body);
      if (teacherValid.error) {
        cleanupFile();
        req.flash("alert", {
          status: "error",
          section: "add",
          message: teacherValid.error.message,
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-teacher");
      }

      const profileImageUrl = `https://files.diamondschools.com.ng/teacher_photos/${req.file.filename}`;

      const password = require("../../../utils/genPassword")(6);

      // Hash password
      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);

      const transaction = await sequelize.transaction();

      try {
        // Create teacher
        const newTeacher = await Teacher.create(
          {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            country: Country.getCountryByCode(req.body.country).name,
            stateOfOrigin: req.body.stateOfOrigin,
            religion: req.body.religion,
            password: hashedPassword,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            profileImageUrl,
          },
          { transaction }
        );
        console.log(newTeacher);

        await transaction.commit();

        req.flash("alert", {
          status: "success",
          section: "add",
          message: `Teacher created successfully. EMAIL: ${req.body.email} PASSWORD: ${password}`,
        });
        req.flash("form", "");
        req.flash("newTeacherId", newTeacher.dataValues.id);
        req.flash("status", 200);
        res.redirect("/dashboard/add-teacher");
      } catch (transError) {
        await transaction.rollback();
        cleanupFile();
        throw transError;
      }
    });
  } catch (error) {
    console.log(error);
    req.flash("alert", {
      status: "error",
      section: "add",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect("/dashboard/add-teacher");
  }
};
