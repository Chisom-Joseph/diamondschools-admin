const { Guardian } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const guardain = await Guardian.findOne({ where: { id } });
    if (!guardain) return {};

    return guardain.dataValues;
  } catch (error) {
    console.log(`ERROR GETTING GUARDIAN: ${error}`);
    return {};
  }
};
