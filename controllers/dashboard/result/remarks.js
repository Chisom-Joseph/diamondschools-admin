const term = require("../../../validation/result/remarks");
const { Student, StudentTermPerformance, Result } = require("../../../models");

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

    const stps = await StudentTermPerformance.findAll({
      where: { StudentId: studentId, TermId: termId },
      include: [{ model: Result, attributes: ["id"] }],
    });

    let studentTermPerformance =
      stps.find((s) => s.Results && s.Results.length > 0) ||
      stps.find((s) => s.totalScore > 0) ||
      stps[0] ||
      null;

    if (!studentTermPerformance) {
      await StudentTermPerformance.create({
        StudentId: studentId,
        TermId: termId,
        ClassId: student.ClassId,
        overallRemark: req.body.generalRemark,
        teachersRemark: req.body.teacherRemark,
      });
    } else {
      await studentTermPerformance.update({
        overallRemark: req.body.generalRemark,
        teachersRemark: req.body.teacherRemark,
      });

      // Clean up any empty duplicate StudentTermPerformance rows for this student & term
      if (stps.length > 1) {
        const duplicateIds = stps
          .filter(
            (s) =>
              s.id !== studentTermPerformance.id &&
              (!s.Results || s.Results.length === 0)
          )
          .map((s) => s.id);
        if (duplicateIds.length > 0) {
          await StudentTermPerformance.destroy({ where: { id: duplicateIds } });
        }
      }
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
