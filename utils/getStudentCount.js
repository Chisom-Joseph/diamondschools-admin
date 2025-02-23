const { Student } = require("../models");

module.exports = async () => {
  try {
    return Student.count();
  } catch (error) {
    console.error("ERROR COUNTING STUDENTS");
    console.error(error);
  }
};
