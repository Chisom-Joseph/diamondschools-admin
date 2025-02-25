const term = require("../../../validation/result/remarks");
const { Student, StudentTermPerformance } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { student: studentId, term: termId } = req.query;
    // Validate academic year input
    const termValid = term.validate(req.body);
    if (termValid.error) {
      req.flash("alert", {
        status: "error",
        section: "remarks",
        message: termValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "remarks");
      return res.redirect(req.originalUrl);
    }

    const student = await Student.findByPk(studentId, {
      attributes: ["ClassId"],
    });

    const studentTermPerformance = await StudentTermPerformance.findOne({
      where: { StudentId: studentId, TermId: termId, ClassId: student.ClassId },
    });

    if (!studentTermPerformance) {
      await StudentTermPerformance.create({
        StudentId: studentId,
        TermId: termId,
        ClassId: student.ClassId,
        overallRemark: req.body.generalRemark,
        teachersRemark: req.body.teacherRemark,
      });
    } else {
      studentTermPerformance.update({
        overallRemark: req.body.generalRemark,
        teachersRemark: req.body.teacherRemark,
      });
    }

    req.flash("alert", {
      status: "success",
      section: "remarks",
      message: "Remarks successfully updated!",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    req.flash("formSection", "remarks");
    res.redirect(req.originalUrl);
  } catch (error) {
    console.error("ERROR ADDING REMARKS");
    console.error(error);
  }
};
