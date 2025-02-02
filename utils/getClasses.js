const { Class } = require("../models");

module.exports = async () => {
  try {
    const classesFromDb = await Class.findAll();

    const classes = Promise.all(
      classesFromDb.map(async (classFromDb) => {
        return classFromDb.dataValues;
      })
    );

    const allClasses = await classes;

    allClasses.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return allClasses;
  } catch (error) {
    console.log(error);
    return [];
  }
};
