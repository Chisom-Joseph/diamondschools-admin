const { Aspirant } = require("../models");
const { Op } = require("sequelize");

module.exports = async (academicYear) => {
  try {
    const prefix = "DNPSS";
    const suffix = "ASP";
    const year = academicYear.split("/")[0];

    // Find the last examination number for the given year
    const lastAspirant = await Aspirant.findOne({
      where: {
        examinationNumber: {
          [Op.like]: `${prefix}-${year}-%-${suffix}`,
        },
      },
      order: [["examinationNumber", "DESC"]],
    });

    let nextNumber = 1;

    if (lastAspirant) {
      const lastExamNumber = lastAspirant.examinationNumber;
      // Example format: DNPSS-2023-007-ASP → we extract the `007`
      const parts = lastExamNumber.split("-");
      const lastNumber = parseInt(parts[2], 10);
      nextNumber = lastNumber + 1;
    }

    const padExamNumber = (number) => {
      return String(number).padStart(3, "0");
    };

    const examNumber = `${prefix}-${year}-${padExamNumber(
      nextNumber
    )}-${suffix}`;

    return examNumber;
  } catch (error) {
    console.log(`ERROR GENERATING EXAM NUMBER: ${error}`);
    return null;
  }
};
