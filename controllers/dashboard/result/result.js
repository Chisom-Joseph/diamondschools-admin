const term = require("../../../validation/result/result");
const {
  Result,
  Student,
  ClassStats,
  StudentTermPerformance,
  Sequelize,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const {
      subject: subjectId,
      totalScore,
      grade,
      firstTest,
      presentation,
      midTermTest,
      project,
      note,
      remark,
      examScore,
    } = req.body;
    const { student: studentId, term: termId } = req.query;

    // Validate input
    const termValid = term.validate(req.body);
    if (termValid.error) {
      req.flash("alert", {
        status: "error",
        section: subjectId,
        message: termValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      req.flash("formSection", subjectId);
      return res.redirect(req.originalUrl);
    }

    // Fetch student info
    const student = await Student.findByPk(studentId);
    if (!student) {
      console.error("Student not found");
      return;
    }
    const stpForClass = await StudentTermPerformance.findOne({ where: { StudentId: studentId, TermId: termId } });
    const classId = stpForClass?.ClassId || student.ClassId;

    // Fetch all results for this subject and term scoped to the student's class
    const classStps = await StudentTermPerformance.findAll({
      where: { TermId: termId, ClassId: classId },
      attributes: ["id"],
      raw: true,
    });
    const stpIds = classStps.map((r) => r.id);
    const existingResults = await Result.findAll({
      where: {
        SubjectId: subjectId,
        StudentTermPerformanceId: { [Sequelize.Op.in]: stpIds },
      },
      attributes: ["id", "totalScore", "StudentTermPerformanceId"],
      order: [["totalScore", "DESC"]],
    });

    let scores = existingResults.map((r) => r.totalScore);

    // Find the student's existing result (if any)
    const stpForStudent = await StudentTermPerformance.findOne({ where: { StudentId: studentId, TermId: termId } });
    let existingResult = stpForStudent
      ? await Result.findOne({
          where: { StudentTermPerformanceId: stpForStudent.id, SubjectId: subjectId },
        })
      : null;

    if (existingResult) {
      // Remove old score from the ranking list
      const oldScoreIndex = scores.indexOf(existingResult.totalScore);
      if (oldScoreIndex !== -1) {
        scores.splice(oldScoreIndex, 1);
      }
    }

    // Add the new score and recalculate stats
    scores.push(totalScore);
    const validScores = scores.filter(
      (s) => s !== null && s !== undefined && !Number.isNaN(Number(s))
    );
    const classAverage =
      validScores.length > 0
        ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
        : 0;
    console.log(`classAverage: ${classAverage}`);
    const classLowest = validScores.length > 0 ? Math.min(...validScores) : 0;
    const classHighest = validScores.length > 0 ? Math.max(...validScores) : 0;

    // Update or create ClassStats
    let classStats = await ClassStats.findOne({
      where: { ClassId: classId, SubjectId: subjectId, TermId: termId },
    });

    if (classStats) {
      await classStats.update({ classAverage, classLowest, classHighest });
    } else {
      await ClassStats.create({
        ClassId: classId,
        SubjectId: subjectId,
        TermId: termId,
        classAverage,
        classLowest,
        classHighest,
      });
    }

    // Save or update the student's result
    if (existingResult) {
      await existingResult.update({
        totalScore,
        grade,
        remark,
        firstTest,
        presentation,
        midTermTest,
        project,
        note,
        examScore,
        date: new Date().toISOString(),
      });
    } else {
      if (stpForStudent) {
        existingResult = await Result.create({
          StudentTermPerformanceId: stpForStudent.id,
          SubjectId: subjectId,
          totalScore,
          grade,
          remark,
          firstTest,
          presentation,
          midTermTest,
          project,
          note,
          examScore,
          position: 0, // Temporary position
          date: new Date().toISOString(),
        });
      }
    }

    // Fetch updated class results for this subject using StudentTermPerformance IDs
    const results = await Result.findAll({
      where: {
        SubjectId: subjectId,
        StudentTermPerformanceId: { [Sequelize.Op.in]: stpIds },
      },
      attributes: ["id", "totalScore", "StudentTermPerformanceId"],
      order: [["totalScore", "DESC"]],
    });

    // Assign positions correctly
    let lastScore = null;
    let lastPosition = 0;
    let sameRankCount = 0;

    for (let i = 0; i < results.length; i++) {
      if (results[i].totalScore !== lastScore) {
        lastPosition += sameRankCount + 1;
        sameRankCount = 0;
      } else {
        sameRankCount++;
      }
      lastScore = results[i].totalScore;

      await Result.update(
        { position: lastPosition },
        { where: { id: results[i].id } }
      );
    }

    // Ensure StudentTermPerformance exists
    let studentTermPerformance = await StudentTermPerformance.findOne({
      where: { StudentId: studentId, TermId: termId, ClassId: classId },
    });

    // Calculate student average score
    const studentResults = stpForStudent
      ? await Result.findAll({
          where: { StudentTermPerformanceId: stpForStudent.id },
          attributes: [[Sequelize.fn("AVG", Sequelize.col("totalScore")), "averageScore"]],
          raw: true,
        })
      : [{ averageScore: 0 }];
    const averageScore = studentResults[0].averageScore || 0;

    const totalScoreSum = stpForStudent
      ? await Result.sum("totalScore", { where: { StudentTermPerformanceId: stpForStudent.id } })
      : 0;

    if (!studentTermPerformance) {
      studentTermPerformance = await StudentTermPerformance.create({
        StudentId: studentId,
        TermId: termId,
        ClassId: classId,
        totalScore: totalScoreSum,
        averageScore,
        position: 0, // Temporary position
      });
    } else {
      await studentTermPerformance.update({
        totalScore: totalScoreSum,
        averageScore,
      });
    }

    // Fetch all student term performances for ranking
    const studentTermPerformances = await StudentTermPerformance.findAll({
      where: { TermId: termId, ClassId: classId },
      attributes: ["id", "StudentId", "totalScore"],
      order: [["totalScore", "DESC"]],
    });

    console.log(studentTermPerformances);

    // Assign term positions correctly
    lastScore = null;
    lastPosition = 0;
    sameRankCount = 0;

    for (let i = 0; i < studentTermPerformances.length; i++) {
      if (studentTermPerformances[i].totalScore !== lastScore) {
        lastPosition += sameRankCount + 1;
        sameRankCount = 0;
      } else {
        sameRankCount++;
      }

      lastScore = studentTermPerformances[i].totalScore;

      // Update the student's position
      await StudentTermPerformance.update(
        { position: lastPosition },
        { where: { id: studentTermPerformances[i].id } }
      );
    }

    req.flash("alert", {
      status: "success",
      section: subjectId,
      message: "Result successfully updated!",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    req.flash("formSection", subjectId);
    res.redirect(req.originalUrl);
  } catch (error) {
    console.error("ERROR UPDATING RESULT");
    console.error(error);
  }
};
