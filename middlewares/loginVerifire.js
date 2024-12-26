const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.aToken;
    const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

    if (!token && !authRoutes.includes(req.originalUrl)) {
      res.clearCookie("aToken");
      return res.redirect("/auth/sign-in");
    }

    if (!token && authRoutes.includes(req.originalUrl)) {
      next();
    }

    const tokenVerified = jwt.verify(token, process.env.A_TOKEN_SECRET);

    if (!tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    if (tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/dashboard");
    }

    if (!tokenVerified && !authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    const admin = await require("../utils/getAdmin")(tokenVerified.id);
    console.log(admin);

    if (Object.keys(admin).length === 0) {
      res.clearCookie("aToken");
      return res.redirect("/auth/sign-in");
    }

    req.admin = admin;
    res.locals.admin = admin;
    res.locals.isLoggedin = true;
    return next();
  } catch (error) {
    console.error(`ERROR VERIFING LOGIN: ${error}`);
  }
};
