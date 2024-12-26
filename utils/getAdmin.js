const { Admin } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const adminFromDb = await Admin.findOne({ where: { id } });
    if (!adminFromDb) return {};

    return adminFromDb.dataValues;
  } catch (error) {
    console.error(`ERROR GETTING ADMIN: ${error}`);
    return {};
  }
};
