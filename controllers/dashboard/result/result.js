const term = require("../../../validation/result/result");
const { Result, Student } = require("../../../models");

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

    // Validate academic year input
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

    // Fetch all results for the same subject, term, and class
    const results = await Result.findAll({
      where: { subjectId, termId },
      include: [{ model: Student, attributes: ["ClassId"] }],
    });

    const existingResults = await Result.findAll({
      where: { subjectId, termId },
      attributes: ["totalScore"],
    });

    const scores = existingResults.map((r) => r.totalScore);

    // Extract total scores
    const totalScores = results.map((r) => r.totalScore);

    // Calculate class average
    const classAverage =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Find lowest and highest scores in the class
    const classLowest = scores.length > 0 ? Math.min(...scores) : 0;
    const classHighest = scores.length > 0 ? Math.max(...scores) : 0;

    // Determine the student's position (rank by descending order)
    const sortedScores = [...totalScores, totalScore].sort((a, b) => b - a);
    const position = sortedScores.indexOf(totalScore) + 1;

    // Assign remark based on grade
    // let remark;
    // if (grade === "A") remark = "Excellent";
    // else if (grade === "B") remark = "Very Good";
    // else if (grade === "C") remark = "Good";
    // else if (grade === "D") remark = "Fair";
    // else if (grade === "E") remark = "Needs Improvement";
    // else remark = "Fail";

    let existingResult = await Result.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, TermId: termId },
    });

    // Save the result to the database
    if (existingResult) {
      const updatedResult = existingResult.update(
        {
          StudentId: studentId,
          SubjectId: subjectId,
          TermId: termId,
          totalScore,
          grade,
          position,
          classAverage,
          classLowest,
          classHighest,
          remark,
          firstTest,
          presentation,
          midTermTest,
          project,
          note,
          examScore,
          date: new Date().toISOString(),
        },
        { where: {} }
      );
      console.log(updatedResult);
    } else {
      const newResult = await Result.create({
        StudentId: studentId,
        SubjectId: subjectId,
        TermId: termId,
        totalScore,
        grade,
        position,
        classAverage,
        classLowest,
        classHighest,
        remark,
        firstTest,
        presentation,
        midTermTest,
        project,
        note,
        examScore,
        date: new Date().toISOString(),
      });
      console.log(newResult);
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
