const editStudentSchema = require("../../../validation/student/editStudentInfo");
const { Country } = require("country-state-city");
const { Student, AcademicYear } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate student
    const studentValid = editStudentSchema.validate(req.body);
    if (studentValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: studentValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(req.baseUrl + req.path);
    }

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

    // Check if academic year exists
    const academicYearFromDb = await AcademicYear.findByPk(
      req.body.academicYear,
      { attibutes: ["year"] }
    );
    if (!academicYearFromDb) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: "Invalid academic year.",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(req.baseUrl + req.path);
    }

    // Update student
    const editedStudent = await Student.update(
      {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        address: req.body.address,
        country: Country.getCountryByCode(req.body.country).name,
        stateOfOrigin: req.body.stateOfOrigin,
        religion: req.body.religion,
        AcademicYearId: req.body.academicYear,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        ClassId: req.body.class,
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
  } catch (error) {
    console.error("ERROR UPDATING STUDENT INFO:");
    console.error(error);
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
