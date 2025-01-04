const { Student } = require("../models");

module.exports = async (id) => {
  try {
    const studentFromDb = await Student.findOne({ where: { id } });
    if (!studentFromDb) return {};

    const student = studentFromDb.dataValues;

    student.guardian = await require("../utils/getGuardian")(
      student.GuardianId
    );

    console.log(student);
    if (student) return student;
    return {};
  } catch (error) {
    console.log("ERROR GETTING ASPIRANT");
    console.log(error);
    return {};
  }
};
