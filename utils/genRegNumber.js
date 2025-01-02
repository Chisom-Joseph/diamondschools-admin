const { Student } = require("../models");

module.exports = async () => {
  let count = 1;
  const genRegNumber = async () => {
    const prefix = "DNPSS";
    const year = new Date().getFullYear();

    const studentsCount = await Student.count();
    const studentsNumber = studentsCount + count;

    const padRegistrationNumber = (number) => {
      return String(number).padStart(3, "0");
    };

    const registrationNumber = `${prefix}-${year}-${padRegistrationNumber(
      studentsNumber
    )}`;

    const studentsNumberExsits = await Student.findOne({
      where: {
        registrationNumber,
      },
    });
    if (studentsNumberExsits) {
      count++;
      return await genRegNumber();
    }

    return registrationNumber;
  };
  return await genRegNumber();
};
