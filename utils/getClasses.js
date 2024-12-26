const { Class } = require("../models");

module.exports = async () => {
  try {
    const classesFromDb = await Class.findAll();

    const classes = Promise.all(
      classesFromDb.map(async (classFromDb) => {
        return classFromDb.dataValues;
      })
    );

    return classes;
  } catch (error) {
    console.log(error);
    return [];
  }
};
