const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { Country } = require("country-state-city");
const addStudentSchema = require("../../../validation/student/add");
const sutdentProfileImageUpload = require("../../../middlewares/studentProfileImageUpload");
const {
  Student,
  Guardian,
  AcademicYear,
  sequelize,
} = require("../../../models");

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
          return res.redirect("/dashboard/add-student");
        } else if (err) {
          req.flash("alert", {
            status: "error",
            message: "Failed to upload file",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/dashboard/add-student");
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
        return res.redirect("/dashboard/add-student");
      }

      // Validate student
      const studentValid = addStudentSchema.validate(req.body);
      if (studentValid.error) {
        cleanupFile();
        req.flash("alert", {
          status: "error",
          section: "add",
          message: studentValid.error.message,
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-student");
      }

      // Check if guardian's email is already in use
      const guardianExists = await Guardian.findOne({
        where: { email: req.body.guardianEmail },
      });
      if (guardianExists) {
        cleanupFile();
        req.flash("alert", {
          status: "error",
          section: "add",
          message: "Guardian email already in use.",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-student");
      }

      const academicYearFromDb = await AcademicYear.findByPk(
        req.body.academicYear,
        { attributes: ["year"] }
      );
      if (!academicYearFromDb) {
        cleanupFile();
        req.flash("alert", {
          status: "error",
          section: "add",
          message: "Invalid academic year.",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-student");
      }

      const profileImageUrl = `https://files.diamondschools.com.ng/student_photos/${req.file.filename}`;

      const registrationNumber = await require("../../../utils/genRegNumber")(
        academicYearFromDb.year
      );
      if (!registrationNumber) {
        cleanupFile();
        req.flash("alert", {
          status: "error",
          message: "Error generating registration number",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-student");
      }

      const password = require("../../../utils/genPassword")(6);

      // Hash password
      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);

      const transaction = await sequelize.transaction();

      try {
        // Create Guardian
        const newGuardian = await Guardian.create(
          {
            firstName: req.body.guardianFirstName,
            middleName: req.body.guardianMiddleName,
            lastName: req.body.guardianLastName,
            email: req.body.guardianEmail,
            phoneNumber: req.body.guardianPhoneNumber,
            relationshipToStudent: req.body.relationshipToStudent,
            address: req.body.guardianAddress,
            occupation: req.body.guardianOccupation,
          },
          { transaction }
        );

        // Create student
        const newStudent = await Student.create(
          {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            address: req.body.address,
            country: Country.getCountryByCode(req.body.country).name,
            stateOfOrigin: req.body.stateOfOrigin,
            religion: req.body.religion,
            AcademicYearId: req.body.academicYear,
            registrationNumber,
            password: hashedPassword,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            profileImageUrl,
            ClassId: req.body.class,
            GuardianId: newGuardian.dataValues.id,
          },
          { transaction }
        );
        console.log(newStudent);

        await transaction.commit();

        req.flash("alert", {
          status: "success",
          section: "add",
          message: `Student created successfully`,
        });
        req.flash("form", "");
        req.flash("newStudentId", newStudent.dataValues.id);
        req.flash(
          "newStudent",
          `REG NUMBER: ${registrationNumber} <br> PASSWORD: ${password}`
        );
        req.flash("status", 200);
        res.redirect("/dashboard/add-student");
      } catch (transError) {
        await transaction.rollback();
        cleanupFile();
        throw transError;
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
    return res.redirect("/dashboard/add-student");
  }
};
