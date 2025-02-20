const { Student, Subject } = require("../models");

module.exports = async (studentId) => {
  try {
    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ["ClassId"], // Only fetch ClassId
    });

    if (!student) {
      return [];
    }

    const subjectsFromDb = await Subject.findAll({
      where: { ClassId: student.ClassId },
    });

    const subjects = Promise.all(
      subjectsFromDb.map(async (subjectFromDb) => {
        const currentSubject = subjectFromDb.dataValues;

        return currentSubject;
      })
    );
    console.log(await subjects);
    return subjects;
  } catch (error) {
    console.log(error);
    return [];
  }
};
