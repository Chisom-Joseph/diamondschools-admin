const { Aspirant } = require("../models");

module.exports = async (
  GuardianId,
  fields = { guardian: true, class: true }
) => {
  try {
    const aspirantsFromDb = await Aspirant.findAll({ where: { GuardianId } });

    const aspirants = Promise.all(
      aspirantsFromDb.map(async (aspirant) => {
        const currentAspirant = aspirant.dataValues;

        // Get guardain
        if (fields.guardian) {
          currentAspirant.guardian = await require("./getGuardian")(
            currentAspirant.GuardianId
          );
        }

        // Class
        if (fields.class) {
          currentAspirant.class = await require("./getClass")(
            currentAspirant.ClassId
          );
        }

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
