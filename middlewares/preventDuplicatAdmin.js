const { Admin } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const adminExists = await Admin.findOne();
    if (adminExists) return res.render("error.ejs", { error: "" });

    return next();
  } catch (error) {
    console.log(`ERROR VERIIFYING ADMIN: ${error}`);
    return res.status(404).render("error.ejs", {
      error: {
        statusCode: 500,
        title: "Internal Server Error",
        message: "Something went wrong. Please try again later.",
      },
    });
  }
};
