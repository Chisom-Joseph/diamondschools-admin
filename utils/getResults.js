const { Result, Subject, Student, ClassStats } = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];

    const results = await Result.findAll({
      where: {
        StudentId: studentId,
        TermId: termId,
      },
      include: [
        {
          model: Subject,
          attributes: ["id", "name"],
        },
      ],
      order: [[Subject, "name", "ASC"]],
    });

    if (results.length <= 0) return [];

    const student = await Student.findByPk(studentId);
    const fallbackClassId = student ? student.ClassId : null;

    const toOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"], v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    for (const result of results) {
      const classStats = await ClassStats.findOne({
        where: {
          ClassId: result.resultClassId || fallbackClassId,
          SubjectId: result.SubjectId,
          TermId: termId,
        },
        attributes: ["classLowest", "classHighest", "classAverage"],
      });

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
