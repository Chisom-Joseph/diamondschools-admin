const { Aspirant } = require("../models");

module.exports = async (academicYear) => {
  const genExamNumber = async () => {
    const prefix = "DNPSS";
    const sufix = "ASP";
    const year = academicYear.split("/")[0];

    const aspirantsCount = await Aspirant.count();
    const aspirantsNumber = aspirantsCount + 1;

    const padExamNumber = (number) => {
      return String(number).padStart(3, "0");
    };

    const examNumber = `${prefix}-${year}-${padExamNumber(
      aspirantsNumber
    )}-${sufix}`;

    const aspirantsNumberExsits = await Aspirant.findOne({
      where: {
        examinationNumber: examNumber,
      },
    });
    if (aspirantsNumberExsits) {
      return await genExamNumber();
    }

    return examNumber;
  };
  return await genExamNumber();
};
