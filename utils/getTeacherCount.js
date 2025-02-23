const { Teacher } = require("../models");

module.exports = async () => {
  try {
    return Teacher.count();
  } catch (error) {
    console.error("ERROR COUNTING TEACHER");
    console.error(error);
  }
};
