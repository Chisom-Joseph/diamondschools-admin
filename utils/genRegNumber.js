const { Student } = require("../models");

module.exports = async (academicYear) => {
  try {
    const prefix = "DNPSS";
    const year = academicYear.split("/")[0];

    // Find the latest registration number for the given year
    const lastStudent = await Student.findOne({
      where: {
        registrationNumber: {
          [require("sequelize").Op.like]: `${prefix}-${year}-%`,
        },
      },
      order: [["registrationNumber", "DESC"]],
    });

    let nextNumber = 1;

    if (lastStudent) {
      const lastReg = lastStudent.registrationNumber;
      const lastNumber = parseInt(lastReg.split("-")[2], 10);
      nextNumber = lastNumber + 1;
    }

    const padRegistrationNumber = (number) => {
      return String(number).padStart(3, "0");
    };

    const registrationNumber = `${prefix}-${year}-${padRegistrationNumber(
      nextNumber
    )}`;

    return registrationNumber;
  } catch (error) {
    console.log(`ERROR GENERATING REGISTRATION NUMBER: ${error}`);
    return null;
  }
};
