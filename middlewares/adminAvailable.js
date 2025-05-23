const { Admin } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const adminCount = await Admin.count();

    if (adminCount === 0 && req.originalUrl !== "/auth/sign-up") {
      res.clearCookie("aToken");
      return res.redirect("/auth/sign-up");
    }

    if (adminCount > 0 && req.originalUrl === "/auth/sign-up") {
      return res.redirect("/");
    }

    return next();
  } catch (error) {
    console.error(`ERROR TRYING TO FIND AVAILABLE ADMINS: ${error}`);

    return res.status(404).render("error.ejs", {
      error: {
        statusCode: 500,
        title: "Internal Server Error",
        message: "Something went wrong. Please try again later.",
      },
    });
  }
};
