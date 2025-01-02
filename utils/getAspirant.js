const { Aspirant } = require("../models");

module.exports = async (id) => {
  try {
    const aspirantFromDb = await Aspirant.findOne({ where: { id } });
    if (!aspirantFromDb) return {};

    const aspirant = aspirantFromDb.dataValues;

    aspirant.profileImageUrl = aspirant.profileImageUrl
      ? `http://localhost:4728${aspirant.profileImageUrl}`
      : "https://via.placeholder.com/150";

    aspirant.paymentProofUrl = aspirant.paymentProofUrl
      ? `http://localhost:4728${aspirant.paymentProofUrl}`
      : "https://via.placeholder.com/150";

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
