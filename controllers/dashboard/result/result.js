const { Op } = require("sequelize");
const { Result, Student } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { subject: subjectId, totalScore, grade } = req.body;
    const { student: studentId, term: termId } = req.query;

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
    let remark;
    if (grade === "A") remark = "Excellent";
    else if (grade === "B") remark = "Very Good";
    else if (grade === "C") remark = "Good";
    else if (grade === "D") remark = "Fair";
    else if (grade === "E") remark = "Needs Improvement";
    else remark = "Fail";

    console.log({
      studentId,
      subjectId,
      termId,
      totalScore,
      grade,
      position,
      classAverage,
      classLowest,
      classHighest,
      remark,
      date: new Date().toISOString(),
    });
    return res.json({
      studentId,
      subjectId,
      termId,
      totalScore,
      grade,
      position,
      classAverage,
      classLowest,
      classHighest,
      remark,
      date: new Date().toISOString(),
    });

    // Save the result to the database
    const result = await Result.create({
      studentId,
      subjectId,
      termId,
      totalScore,
      grade,
      position,
      classAverage,
      classLowest,
      classHighest,
      remark,
      date: new Date().toISOString(),
    });

    return res.json({ form: req.body, query: req.query });
  } catch (error) {
    console.error("ERROR UPDATING RESULT");
    console.error(error);
  }
};
