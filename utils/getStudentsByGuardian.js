const { Student } = require("../models");

module.exports = async (
  GuardianId,
  fields = { guardian: true, class: true }
) => {
  try {
    const studentsFromDb = await Student.findAll({
      where: { GuardianId },
    });

    const students = Promise.all(
      studentsFromDb.map(async (student) => {
        const currentStudent = student.dataValues;

        // Get guardain
        if (fields.guardian) {
          currentStudent.guardian = await require("./getGuardian")(
            currentStudent.GuardianId
          );
        }

        // Class
        if (fields.class) {
          currentStudent.class = await require("./getClass")(
            currentStudent.ClassId
          );
        }

        return currentStudent;
      })
    );

    return students;
  } catch (error) {
    console.log(`ERROR GETTING STUDENTS: ${error}`);
    return [];
  }
};
