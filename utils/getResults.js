const { Result, Subject, Student, ClassStats, StudentTermPerformance, Sequelize } = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];

    const stp = await StudentTermPerformance.findOne({ where: { StudentId: studentId, TermId: termId } });
    if (!stp) return [];
    const results = await Result.findAll({
      where: { StudentTermPerformanceId: stp.id },
      include: [{
        model: Subject,
        attributes: ["id", "name"],
      }],
      order: [[Subject, "name", "ASC"]],
    });

    if (results.length <= 0) return [];

    const student = await Student.findByPk(studentId);
    const fallbackClassId = student ? student.ClassId : null;
    const effectiveClassId = stp?.ClassId || fallbackClassId;

    const toOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"], v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Fetch ClassStats for all subjects in the results in a single query
    const subjectIds = results.map(r => r.SubjectId);
    let classStatsList = [];
    if (subjectIds.length > 0) {
      classStatsList = await ClassStats.findAll({
        where: {
          ClassId: effectiveClassId,
          TermId: termId,
          SubjectId: { [Sequelize.Op.in]: subjectIds }
        },
        attributes: ["SubjectId", "classLowest", "classHighest", "classAverage"],
      });
    }

    const classStatsMap = {};
    for (const cs of classStatsList) {
      classStatsMap[cs.SubjectId] = cs;
    }

    for (const result of results) {
      const classStats = classStatsMap[result.SubjectId];

      result.dataValues.classStats = classStats || {
        classLowest: null,
        classHighest: null,
        classAverage: null,
      };

      if (result.position) result.position = toOrdinal(result.position);
    }

    return results;
  } catch (error) {
    console.error("ERROR GETTING RESULTS");
    console.error(error);
    return [];
  }
};
