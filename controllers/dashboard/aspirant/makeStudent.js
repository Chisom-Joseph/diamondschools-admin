const bcrypt = require("bcryptjs");
const { Aspirant, Student, AcademicYear } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Check if request contains request id
    const id = req.params.id;
    if (!id) {
      req.flash("alert", {
        status: "error",
        message: "Invalid Request",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(`/dashboard/aspirant/${req.params.id}`);
    }

    // Check if aspirant exists
    const aspirantExists = await Aspirant.findOne({
      where: { id },
    });
    if (!aspirantExists) {
      req.flash("alert", {
        status: "error",
        message: "Aspirant does not exist",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(`/dashboard/aspirant/${req.params.id}`);
    }

    // Check if aspirant is already a student
    if (aspirantExists.isStudent) {
      req.flash("alert", {
        status: "error",
        message: "Aspirant is already a student",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(`/dashboard/aspirant/${req.params.id}`);
    }
    
    const aspirant = aspirantExists.dataValues;
    const {
      firstName,
      middleName,
      lastName,
      country,
      stateOfOrigin,
      profileImageUrl,
      address,
      religion,
      gender,
      dateOfBirth,
      GuardianId,
      ClassId,
      AcademicYearId
    } = aspirant;
    
    const academicYearFromDb = await AcademicYear.findByPk(AcademicYearId, { attibutes: ["year"] })
    if (!academicYearFromDb) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: "Invalid academic year.",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(`/dashboard/aspirant/${req.params.id}`);
    }

    // Genetate Registration Number
    const registrationNumber = await require("../../../utils/genRegNumber")(academicYearFromDb.year);

    // Generate Password
    const password = await require("../../../utils/genPassword")();

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log({ registrationNumber, password, hashedPassword });

    // Add student to db
    const newStudent = await Student.create({
      firstName,
      middleName,
      lastName,
      country,
      stateOfOrigin,
      profileImageUrl,
      address,
      religion,
      gender,
      dateOfBirth,
      registrationNumber,
      password: hashedPassword,
      GuardianId,
      ClassId,
      AcademicYearId
    });
    console.log(newStudent);

    // Update aspirant
    const updatedAspirant = await Aspirant.update(
      { isStudent: newStudent.id },
      { where: { id } }
    );
    console.log(updatedAspirant);

    req.flash("alert", {
      status: "success",
      message: `Student created successfully. REG NUMBER: ${registrationNumber} PASSWORD: ${password}`,
    });
    req.flash("form", "");
    req.flash("newStudentId", newStudent.dataValues.id);
    req.flash("status", 200);
    return res.redirect(`/dashboard/aspirant/${req.params.id}`);
  } catch (error) {
    console.log("ERROR MAKING STUDENT");
    console.log(error);
  }
};
