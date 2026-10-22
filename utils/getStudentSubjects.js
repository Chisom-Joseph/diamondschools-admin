const {
  Student,
  Subject,
  Result,
  Class,
  StudentTermPerformance,
  Sequelize,
} = require("../models");

module.exports = async (studentId, termId) => {
  try {
    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ["ClassId"], // Only fetch ClassId
    });

    if (!student) {
      return { subjects: [], resultsMap: {} };
    }

    // Fetch existing StudentTermPerformance & results for this student & term
    const stps = termId
      ? await StudentTermPerformance.findAll({
          where: { StudentId: studentId, TermId: termId },
          include: [{ model: Result, attributes: ["id"] }],
        })
      : [];

    const stp =
      stps.find((s) => s.Results && s.Results.length > 0) ||
      stps.find((s) => s.totalScore > 0) ||
      stps[0] ||
      null;

    // Use the class the student belonged to in that term (falling back to current class)
    const effectiveClassId = stp?.ClassId || student.ClassId;

    // Fetch all subjects for the effective class
    const subjects = await Subject.findAll({
      include: {
        model: Class,
        where: { id: effectiveClassId },
        through: { attributes: [] },
      },
    });

    const results =
      stps.length > 0
        ? await Result.findAll({
            where: {
              StudentTermPerformanceId: {
                [Sequelize.Op.in]: stps.map((s) => s.id),
              },
            },
            include: [{ model: Subject, attributes: ["id", "name"] }],
          })
        : [];

    // Map results to easily find scores for each subject, and include any subject that already has a recorded result
    const resultsMap = {};
    const subjectIdsInList = new Set(subjects.map((s) => s.id));
    if (results.length > 0) {
      results.forEach((result) => {
        if (result.Subject) {
          resultsMap[result.Subject.id] = result; // Store result by subject ID
          if (!subjectIdsInList.has(result.Subject.id)) {
            subjects.push(result.Subject);
            subjectIdsInList.add(result.Subject.id);
          }
        }
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
