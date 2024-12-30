const { Religion } = require("../models");

module.exports = async () => {
  try {
    const religionsFromDb = await Religion.findAll();

    const religions = Promise.all(
      religionsFromDb.map(async (religionFromDb) => {
        return religionFromDb.dataValues;
      })
    );

    return religions;
  } catch (error) {
    console.log(error);
    return [];
  }
};
