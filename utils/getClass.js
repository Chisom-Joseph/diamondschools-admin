const { Class } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const classFromDb = await Class.findOne({ where: { id } });
    if (!classFromDb) return {};

    return classFromDb.dataValues;
  } catch (error) {
    console.log(`ERROR GETTING CLASS: ${error}`);
    return {};
  }
};
