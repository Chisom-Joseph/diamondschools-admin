const { Student, Subject, Result, Class } = require("../models");

module.exports = async (studentId, termId) => {
  try {
    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ["ClassId"], // Only fetch ClassId
    });

    if (!student) {
      return { subjects: [], resultsMap: {} };
    }
    // Fetch all subjects the student is enrolled in
    const subjects = await Subject.findAll({
      include: {
        model: Class,
        where: { id: student.ClassId },
        through: { attributes: [] },
      },
    });

    // Fetch existing results for this student & term
    const results = await Result.findAll({
      where: { StudentId: studentId, TermId: termId },
      include: [{ model: Subject, attributes: ["id", "name"] }],
    });

    // Map results to easily find scores for each subject
    const resultsMap = {};
    if (results.length > 0) {
      results.forEach((result) => {
        resultsMap[result.Subject.id] = result; // Store result by subject ID
      });
    }

    return {
      subjects: subjects.length ? subjects : [],
      resultsMap: Object.keys(resultsMap).length ? resultsMap : {},
    };
  } catch (error) {
    console.error("ERROR GETTING SUBJECTS AND RESULT MAP");
    console.error(error);
    return { subjects: [], resultsMap: {} };
  }
};
