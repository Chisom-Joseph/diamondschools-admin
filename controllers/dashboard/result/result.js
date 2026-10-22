const term = require("../../../validation/result/result");
const {
  Result,
  Student,
  ClassStats,
  StudentTermPerformance,
  Sequelize,
} = require("../../../models");

module.exports = async (req, res, next) => {
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

    // Guard against missing query params
    if (!studentId || !termId) {
      req.flash("alert", {
        status: "error",
        section: subjectId,
        message: "Missing student or term parameter.",
      });
      req.flash("status", 400);
      return res.redirect(req.originalUrl);
    }

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

    // Find existing StudentTermPerformance for this student & term (preferring one that already has results)
    const stps = await StudentTermPerformance.findAll({
      where: { StudentId: studentId, TermId: termId },
      include: [{ model: Result, attributes: ["id"] }],
    });

    let stpForStudent =
      stps.find((s) => s.Results && s.Results.length > 0) ||
      stps.find((s) => s.totalScore > 0) ||
      stps[0] ||
      null;

    // Clean up any empty duplicate StudentTermPerformance rows for this student & term
    if (stpForStudent && stps.length > 1) {
      const emptyDuplicates = stps.filter(
        (s) =>
          s.id !== stpForStudent.id && (!s.Results || s.Results.length === 0)
      );
      for (const dup of emptyDuplicates) {
        const remarkUpdates = {};
        if (!stpForStudent.overallRemark && dup.overallRemark) {
          remarkUpdates.overallRemark = dup.overallRemark;
        }
        if (!stpForStudent.teachersRemark && dup.teachersRemark) {
          remarkUpdates.teachersRemark = dup.teachersRemark;
        }
        if (Object.keys(remarkUpdates).length > 0) {
          await stpForStudent.update(remarkUpdates);
        }
      }
      const duplicateIds = emptyDuplicates.map((s) => s.id);
      if (duplicateIds.length > 0) {
        await StudentTermPerformance.destroy({ where: { id: duplicateIds } });
      }
    }

    const classId = stpForStudent?.ClassId || student.ClassId;

    // Ensure StudentTermPerformance exists before creating/updating Result and querying classStps
    if (!stpForStudent) {
      stpForStudent = await StudentTermPerformance.create({
        StudentId: studentId,
        TermId: termId,
        ClassId: classId,
        totalScore: 0,
        averageScore: 0,
        position: 0,
      });
    }

    // Fetch all results for this subject and term scoped to the student's term class
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

    let scores = existingResults.map((r) => Number(r.totalScore));

    // Find the student's existing result (if any)
    let existingResult = await Result.findOne({
      where: {
        StudentTermPerformanceId: stpForStudent.id,
        SubjectId: subjectId,
      },
    });

    if (existingResult) {
      // Remove old score from the ranking list
      const oldScoreIndex = scores.indexOf(Number(existingResult.totalScore));
      if (oldScoreIndex !== -1) {
        scores.splice(oldScoreIndex, 1);
      }
    }

    // Add the new score and recalculate stats
    const numericTotalScore = Number(totalScore);
    scores.push(numericTotalScore);
    const validScores = scores
      .filter((s) => s !== null && s !== undefined && !Number.isNaN(Number(s)))
      .map((s) => Number(s));
    const classAverage =
      validScores.length > 0
        ? validScores.reduce((sum, score) => sum + score, 0) /
          validScores.length
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
        totalScore: numericTotalScore,
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
      existingResult = await Result.create({
        StudentTermPerformanceId: stpForStudent.id,
        SubjectId: subjectId,
        totalScore: numericTotalScore,
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

    // Fetch updated class results for this subject using StudentTermPerformance IDs
    const results = await Result.findAll({
      where: {
        SubjectId: subjectId,
        StudentTermPerformanceId: { [Sequelize.Op.in]: stpIds },
      },
      attributes: ["id", "totalScore", "StudentTermPerformanceId"],
      order: [["totalScore", "DESC"]],
    });

    // Assign positions correctly in parallel
    let lastScore = undefined;
    let lastPosition = 0;
    let sameRankCount = 0;
    const resultPromises = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].totalScore !== lastScore) {
        lastPosition += sameRankCount + 1;
        sameRankCount = 0;
      } else {
        sameRankCount++;
      }
      lastScore = results[i].totalScore;

      resultPromises.push(
        Result.update(
          { position: lastPosition },
          { where: { id: results[i].id } }
        )
      );
    }
    await Promise.all(resultPromises);

    // Calculate student average score and total score
    const studentResults = await Result.findAll({
      where: { StudentTermPerformanceId: stpForStudent.id },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("totalScore")), "averageScore"],
      ],
      raw: true,
    });
    const averageScore = studentResults[0]?.averageScore || 0;

    const totalScoreSum =
      (await Result.sum("totalScore", {
        where: { StudentTermPerformanceId: stpForStudent.id },
      })) || 0;

    await stpForStudent.update({
      totalScore: totalScoreSum,
      averageScore,
    });

    // Fetch all student term performances for ranking
    const studentTermPerformances = await StudentTermPerformance.findAll({
      where: { TermId: termId, ClassId: classId },
      attributes: ["id", "StudentId", "totalScore"],
      order: [["totalScore", "DESC"]],
    });

    console.log(studentTermPerformances);

    // Assign term positions correctly — reset counters for a fresh ranking pass
    lastScore = undefined;
    lastPosition = 0;
    sameRankCount = 0;
    const stpPromises = [];
    for (let i = 0; i < studentTermPerformances.length; i++) {
      if (studentTermPerformances[i].totalScore !== lastScore) {
        lastPosition += sameRankCount + 1;
        sameRankCount = 0;
      } else {
        sameRankCount++;
      }

      lastScore = studentTermPerformances[i].totalScore;

      // Update the student's position in parallel
      stpPromises.push(
        StudentTermPerformance.update(
          { position: lastPosition },
          { where: { id: studentTermPerformances[i].id } }
        )
      );
    }
    await Promise.all(stpPromises);

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

    req.flash("alert", {
      status: "error",
      section: "",
      message: "An unexpected error occurred while updating the result.",
    });
    req.flash("status", 500);
    return res.redirect(req.originalUrl);
  }
};
