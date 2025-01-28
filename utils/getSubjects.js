const { Subject, Class } = require("../models");

module.exports = async (addBreak = true) => {
  try {
    const subjectsFromDb = await Subject.findAll({
      include: [
        {
          model: Class,
          attibutes: ["id", "name"],
        },
      ],
      attibutes: ["id", "name"],
    });

    const subjects = Promise.all(
      subjectsFromDb.map(async (subjectFromDb) => {
        const currentSubject = subjectFromDb.dataValues;

        currentSubject.class = {};
        if (currentSubject.Class) {
          currentSubject.class = currentSubject.Class.dataValues;
        }
        delete currentSubject.Class;
        delete currentSubject.ClassId;

        return currentSubject;
      })
    );

    if (addBreak) {
      return [
        {
          id: "break",
          name: "Break",
          shortName: "Break",
          class: {},
        },
        ...(await subjects),
      ];
    }
    return [...(await subjects)];
  } catch (error) {
    console.log(error);
    return [];
  }
};
