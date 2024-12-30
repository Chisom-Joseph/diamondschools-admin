const { Aspirant, Guardian } = require("../models");

module.exports = async () => {
  try {
    const aspirantsFromDb = await Aspirant.findAll();

    const aspirants = Promise.all(
      aspirantsFromDb.map(async (aspirant) => {
        const currentAspirant = aspirant.dataValues;

        // Get guardain
        currentAspirant.guardian = await require("./getGuardian")(
          currentAspirant.GuardianId
        );

        // Class
        currentAspirant.class = await require("./getClass")(
          currentAspirant.ClassId
        );

        return currentAspirant;
      })
    );

    console.log(await aspirants);
    return aspirants;
  } catch (error) {
    console.log(`ERROR GETTING STUDENTS: ${error}`);
    return [];
  }
};
