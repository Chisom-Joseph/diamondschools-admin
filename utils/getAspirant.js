const { Aspirant } = require("../models");

module.exports = async (id) => {
  try {
    const aspirantFromDb = await Aspirant.findOne({ where: { id } });
    if (!aspirantFromDb) return {};

    const aspirant = aspirantFromDb.dataValues;

    aspirant.guardian = await require("../utils/getGuardian")(
      aspirant.GuardianId
    );

    console.log(aspirant);
    if (aspirant) return aspirant;
    return {};
  } catch (error) {
    console.log("ERROR GETTING ASPIRANT");
    console.log(error);
    return {};
  }
};
