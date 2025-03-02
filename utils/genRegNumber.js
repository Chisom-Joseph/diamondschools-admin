const { Student } = require("../models");

module.exports = async (academicYear) => {
  try {
    let count = 1;
    const genRegNumber = async () => {
      const prefix = "DNPSS";
      const year = academicYear.split("/")[0];

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
  } catch (error) {
    console.log(`ERROR GENERATING REGISTRATION NUMBER: ${error}`);
    return null;
  }
};
