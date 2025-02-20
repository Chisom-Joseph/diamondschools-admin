const { Student, Subject, Result } = require("../models");

module.exports = async (studentId, termId) => {
  try {
    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ["ClassId"], // Only fetch ClassId
    });

    if (!student) {
      return [];
    }
    // Fetch all subjects the student is enrolled in
    const subjects = await Subject.findAll({
      where: { ClassId: student.ClassId },
    });

    // Fetch existing results for this student & term
    const results = await Result.findAll({
      where: { StudentId: studentId, TermId: termId },
      include: [{ model: Subject, attributes: ["id", "name"] }],
    });

    // Map results to easily find scores for each subject
    const resultsMap = {};
    results.forEach((result) => {
      resultsMap[result.Subject.id] = result; // Store result by subject ID
    });

    return { subjects, resultsMap };
  } catch (error) {
    console.log(error);
    return [];
  }
};
