const { Student, Guardian } = require("../models");

module.exports = async () => {
  try {
    const studentsFromDb = await Student.findAll();

    const students = Promise.all(
      studentsFromDb.map(async (student) => {
        const currentStudent = student.dataValues;

        // Get guardain
        currentStudent.guardian = await require("./getGuardian")(
          currentStudent.GuardianId
        );

        // Class
        currentStudent.class = await require("./getClass")(
          currentStudent.ClassId
        );

        return currentStudent;
      })
    );

    console.log(await students);
    return students;
  } catch (error) {
    console.log(`ERROR GETTING STUDENTS: ${error}`);
    return [];
  }
};
