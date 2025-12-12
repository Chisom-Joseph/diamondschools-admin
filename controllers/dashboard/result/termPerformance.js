const { Student, StudentTermPerformance, Class, Result, Sequelize } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const studentId = req.query.student || req.body.student;
    const termId = req.query.term || req.body.term;
    const { classId } = req.body;

    if (!termId) {
      req.flash("alert", {
        status: "error",
        section: "remarks",
        message: "Please select a term before updating result class.",
      });
      req.flash("status", 400);
      req.flash("formSection", "remarks");
      return res.redirect(`/dashboard/result?student=${studentId || ''}&term=${termId || ''}`);
    }

    if (!classId) {
      req.flash("alert", {
        status: "error",
        section: "remarks",
        message: "Please select a result class.",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "remarks");
      return res.redirect(`/dashboard/result?student=${studentId || ''}&term=${termId || ''}`);
    }

    const targetClass = await Class.findByPk(classId);
    if (!targetClass) {
      req.flash("alert", {
        status: "error",
        section: "remarks",
        message: "Selected class not found.",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", "remarks");
      return res.redirect(`/dashboard/result?student=${studentId || ''}&term=${termId || ''}`);
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      req.flash("alert", {
        status: "error",
        section: "remarks",
        message: "Student not found.",
      });
      req.flash("status", 404);
      req.flash("formSection", "remarks");
      return res.redirect(req.originalUrl);
    }

    let stp = await StudentTermPerformance.findOne({
      where: { StudentId: studentId, TermId: termId },
    });

    let totalScoreSum = 0;
    let averageScore = 0;

    if (!stp) {
      stp = await StudentTermPerformance.create({
        StudentId: studentId,
        TermId: termId,
        ClassId: classId,
        totalScore: totalScoreSum || 0,
        averageScore,
        position: 0,
      });
    } else {
      await stp.update({ ClassId: classId });
    }

    totalScoreSum = await Result.sum("totalScore", {
      where: { StudentTermPerformanceId: stp.id },
    });
    const studentResults = await Result.findAll({
      where: { StudentTermPerformanceId: stp.id },
      attributes: [[Sequelize.fn("AVG", Sequelize.col("totalScore")), "averageScore"]],
      raw: true,
    });
    averageScore = studentResults[0]?.averageScore || 0;
    await stp.update({ totalScore: totalScoreSum || 0, averageScore });

    // Recompute subject-level positions within the selected class
    const studentSubjects = await Result.findAll({
      where: { StudentTermPerformanceId: stp.id },
      attributes: ["SubjectId"],
      group: ["SubjectId"],
      raw: true,
    });

    for (const { SubjectId } of studentSubjects) {
      const classStps = await StudentTermPerformance.findAll({
        where: { TermId: termId, ClassId: classId },
        attributes: ["id"],
        raw: true,
      });
      const stpIds = classStps.map((r) => r.id);
      const classResults = await Result.findAll({
        where: { SubjectId, StudentTermPerformanceId: { [Sequelize.Op.in]: stpIds } },
        attributes: ["id", "totalScore", "StudentTermPerformanceId"],
        order: [["totalScore", "DESC"]],
      });

      let lastScore = null;
      let lastPosition = 0;
      let sameRankCount = 0;

      for (let i = 0; i < classResults.length; i++) {
        if (classResults[i].totalScore !== lastScore) {
          lastPosition += sameRankCount + 1;
          sameRankCount = 0;
        } else {
          sameRankCount++;
        }
        lastScore = classResults[i].totalScore;

        await Result.update(
          { position: lastPosition },
          { where: { id: classResults[i].id } }
        );
      }
    }

    const stps = await StudentTermPerformance.findAll({
      where: { TermId: termId, ClassId: classId },
      attributes: ["id", "StudentId", "totalScore"],
      order: [["totalScore", "DESC"]],
    });

    let lastScore = null;
    let lastPosition = 0;
    let sameRankCount = 0;

    for (let i = 0; i < stps.length; i++) {
      if (stps[i].totalScore !== lastScore) {
        lastPosition += sameRankCount + 1;
        sameRankCount = 0;
      } else {
        sameRankCount++;
      }
      lastScore = stps[i].totalScore;

      await StudentTermPerformance.update(
        { position: lastPosition },
        { where: { id: stps[i].id } }
      );
    }

    req.flash("alert", {
      status: "success",
      section: "remarks",
      message: "Result class updated!",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    req.flash("formSection", "remarks");
    return res.redirect(`/dashboard/result?student=${studentId || ''}&term=${termId || ''}`);
  } catch (error) {
    console.error("ERROR UPDATING TERM PERFORMANCE CLASS");
    console.error(error);
  }
};
