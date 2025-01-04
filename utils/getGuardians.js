const { Guardian } = require("../models");

module.exports = async () => {
  try {
    const guardiansFromDb = await Guardian.findAll();

    const guardians = Promise.all(
      guardiansFromDb.map(async (guardian) => {
        const currentGuardian = guardian.dataValues;

        return currentGuardian;
      })
    );

    console.log(await guardians);
    return guardians;
  } catch (error) {
    console.log(`ERROR GETTING STUDENTS: ${error}`);
    return [];
  }
};
