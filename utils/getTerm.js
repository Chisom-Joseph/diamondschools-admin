const { Term, AcademicYear } = require("../models");

module.exports = async (id) => {
  console.log(`ID: ${id}`);
  try {
    if (!id) return {};
    const termFromDb = await Term.findOne({
      include: AcademicYear,
      where: { id },
    });

    if (!termFromDb) return {};

    return termFromDb;
  } catch (error) {
    console.log("ERROR GETTING TERMS");
    console.log(error);
    return {};
  }
};
