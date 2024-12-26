const { Admin } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const adminExists = await Admin.findOne();
    if (adminExists) return res.render("error.ejs");

    return next();
  } catch (error) {
    console(`ERROR VERIIFYING ADMIN: ${error}`);
  }
};
