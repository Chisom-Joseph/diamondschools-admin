const axios = require("axios");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { Country } = require("country-state-city");
const addAspirantSchema = require("../../../validation/aspirant/add");
const sutdentProfileImageUpload = require("../../../middlewares/aspirantProfileImageUpload");
const { Aspirant, Guardian, AcademicYear, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  try {
    sutdentProfileImageUpload(req, res, async (err) => {
      // Validate aspirant
      const aspirantValid = addAspirantSchema.validate(req.body);
      if (aspirantValid.error) {
        req.flash("alert", {
          status: "error",
          section: "add",
          message: aspirantValid.error.message,
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-aspirant");
      }

      // Check if guardian's email is already in use
      const guardianExists = await Guardian.findOne({
        where: { email: req.body.guardianEmail },
      });
      if (guardianExists) {
        req.flash("alert", {
          status: "error",
          section: "add",
          message: "Guardian email already in use.",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-aspirant");
      }

      const academicYearFromDb = await AcademicYear.findByPk(req.body.academicYear, { attibutes: ["year"] })
      if (!academicYearFromDb) {
        req.flash("alert", {
          status: "error",
          section: "add",
          message: "Invalid academic year.",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-aspirant");
      }

      // Handle profile image errors
      if (err instanceof multer.MulterError) {
        if ((err.code = "LIMIT_FILE_SIZE")) {
          req.flash("alert", {
            status: "error",
            message: "File size too large. Maximum file size is 2MB",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/dashboard/add-aspirant");
        } else if (err) {
          req.flash("alert", {
            status: "error",
            message: "Failed to upload file",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/dashboard/add-aspirant");
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
        return res.redirect("/dashboard/add-aspirant");
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      const FormData = require("form-data");
      const formData = new FormData();
      formData.append("file", fileBuffer, fileName);

      // Upload image
      let profileImageUrl;
      try {
        const response = await axios.post(
          `${process.env.MAIN_WEBSITE_URL}/api/addstudentPhoto`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `bearer ${process.env.MAIN_WEBSITE_ACCESS_TOKEN}`,
            },
          }
        );
        profileImageUrl = response.data.file.profileImageUrl;
        console.log(response.data);
      } catch (error) {
        // Handle Axios errors
        req.flash("alert", {
          status: "error",
          message: "Error uploading profile image",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/dashboard/add-aspirant");
      }

      const country = Country.getCountryByCode(req.body.country).name;
      const examinationNumber = await require("../../../utils/genExamNumber")(academicYearFromDb.year);
      const examinationDate =
        await require("../../../utils/getExaminationDate")();
      const password = require("../../../utils/genPassword")(6);

      // Hash password
      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);

      const transaction = await sequelize.transaction();

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

      // Create aspirant
      const newAspirant = await Aspirant.create(
        {
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          address: req.body.address,
          country,
          stateOfOrigin: req.body.stateOfOrigin,
          religion: req.body.religion,
          AcademicYearId: req.body.academicYear,
          examinationNumber,
          examinationDate,
          password: hashedPassword,
          gender: req.body.gender,
          dateOfBirth: req.body.dateOfBirth,
          profileImageUrl,
          ClassId: req.body.class,
          GuardianId: newGuardian.dataValues.id,
        },
        { transaction }
      );
      console.log(newAspirant);

      await transaction.commit();

      // Send email

      req.flash("alert", {
        status: "success",
        section: "add",
        message: `Aspirant created successfully. EXAM NUMBER: ${examinationNumber} PASSWORD: ${password}`,
      });
      req.flash("form", "");
      req.flash("newAspirantId", newAspirant.dataValues.id);
      req.flash("status", 200);
      res.redirect("/dashboard/add-aspirant");
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
    return res.redirect("/dashboard/add-aspirant");
  }
};
