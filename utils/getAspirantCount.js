const { Aspirant } = require("../models");

module.exports = async () => {
  try {
    return Aspirant.count();
  } catch (error) {
    console.error("ERROR COUNTING ASPIRANT");
    console.error(error);
  }
};
