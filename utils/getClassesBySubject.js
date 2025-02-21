const { Class, Subject } = require("../models");

module.exports = async (subjectId) => {
  try {
    const classesFromDb = await Class.findAll({
      include: {
        model: Subject,
        where: { id: subjectId },
        attributes: [],
      },
    });

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

    console.log(allClasses);

    return allClasses;
  } catch (error) {
    console.log(error);
    return [];
  }
};
