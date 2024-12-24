const bcrypt = require("bcryptjs");
const addStudentSchema = require("../../../validation/student/add");
const { Student, Guardian } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate student
    const studentValid = addStudentSchema.validate(req.body);
    if (studentValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: studentValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/add-student");
    }

    // Check if student already exists
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: "Student already exists.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/add-student");
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
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/add-student");
    }

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(
      require("../../../utils/genPassword")(6),
      salt
    );

    // Create Guardian
    const newGuardian = await Guardian.create({
      firstName: req.body.guardianFirstName,
      middleName: req.body.guardianMiddleName,
      lastName: req.body.guardianLastName,
      email: req.body.guardianEmail,
      phoneNumber: req.body.guardianPhone,
      relationshipToStudent: req.body.guardianRelationship,
      address: req.body.guardianAddress,
      occupation: req.body.guardianOcupation,
    });
    console.log(newGuardian);

    // Create student
    const newStudent = await Student.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      registrationNumber: require("../../../utils/genRegNumber")(),
      password: hashedPassword,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      GuardianId: newGuardian.dataValues.id,
    });
    console.log(newStudent);

    // Send email

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Student created successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/add-student");
  } catch (error) {
    console.log(error);
    req.flash("alert", {
      status: "error",
      section: "add",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("formSection", "add");
    req.flash("status", 400);
    return res.redirect("/dashboard/add-student");
  }
};
