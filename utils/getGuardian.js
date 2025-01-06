const { Guardian } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const guardianFromDb = await Guardian.findOne({ where: { id } });
    if (!guardianFromDb) return {};

    const guardian = guardianFromDb.dataValues;

    // Aspirants
    const aspirants = await require("./getAspirantsByGuardian")(guardian.id, {
      guardian: false,
    });
    guardian.aspirants = aspirants;

    // Students
    const students = await require("./getStudentsByGuardian")(guardian.id, {
      guardian: false,
    });
    guardian.students = students;

    return guardian;
  } catch (error) {
    console.log(`ERROR GETTING GUARDIAN: ${error}`);
    return {};
  }
};
