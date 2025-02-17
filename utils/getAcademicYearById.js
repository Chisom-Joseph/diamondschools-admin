const { AcademicYear } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const academicYearFromDb = await AcademicYear.findOne({
      where: { id },
    });

    if (!academicYearFromDb) return {};

    return academicYearFromDb.dataValues;
  } catch (error) {
    console.log("ERROR GETTING ACADEMIC YEARS");
    console.log(error);
    return {};
  }
};
