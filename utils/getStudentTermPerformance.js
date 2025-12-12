const { StudentTermPerformance, Student } = require("../models")

module.exports = async ({ studentId, classId, termId }) => {
  try {
    let resolvedClassId = classId;
    if (!resolvedClassId && studentId) {
      const student = await Student.findByPk(studentId, { attributes: ["ClassId"] });
      resolvedClassId = student ? student.ClassId : null;
    }

    const where = resolvedClassId
      ? { StudentId: studentId, TermId: termId, }
      : { StudentId: studentId, TermId: termId };

    const studentTermPerformance = await StudentTermPerformance.findOne({ where });
    if (!studentTermPerformance) return {};
    return studentTermPerformance;
  } catch (error) {
    console.error("ERROR GETTING STUDENT TERM PERFORMANCE");
    console.error(error);
    return {};
  }
}
