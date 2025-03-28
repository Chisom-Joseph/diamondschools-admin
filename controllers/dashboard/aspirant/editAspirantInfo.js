const editAspirantSchema = require("../../../validation/aspirant/editAspirantInfo");
const { Country } = require("country-state-city");
const { Aspirant, AcademicYear } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate aspirant
    const aspirantValid = editAspirantSchema.validate(req.body);
    if (aspirantValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: aspirantValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect(req.baseUrl + req.path);
    }

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

    // Update aspirant
    const editedAspirant = await Aspirant.update(
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
      { where: { id: aspirantId } }
    );
    console.log(editedAspirant);

    // Send alert
    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Aspirant ${
        req.body.aspirantId ? aspirant.examnitaionNumber : ""
      } updated successfully`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    return res.redirect(req.baseUrl + req.path);
  } catch (error) {
    console.error("ERROR UPDATING ASPIRANT INFO:");
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
