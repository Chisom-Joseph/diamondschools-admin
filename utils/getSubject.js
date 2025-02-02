const { Subject, Class } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const subjectFromDb = await Subject.findOne({
      include: [
        {
          model: Class,
          attibutes: ["id", "name"],
        },
      ],
      attibutes: ["id", "name"],
      where: { id },
    });

    if (!subjectFromDb) return {};

    const subject = subjectFromDb.dataValues;

    subject.class = {};
    if (subject.Class) {
      subject.class = subject.Class.dataValues;
    }
    delete subject.Class;

    console.log(await subject);
    return subject;
  } catch (error) {
    console.log("ERROR GETTING SUBJECT");
    console.log(error);
    return {};
  }
};
