const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.aToken;
    const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

    // No token & not on auth route → redirect
    if (!token && !authRoutes.includes(req.originalUrl)) {
      res.clearCookie("aToken");
      return res.redirect("/auth/sign-in");
    }

    // No token & on auth route → allow
    if (!token && authRoutes.includes(req.originalUrl)) {
      return next(); // ✅ Add return here
    }

    // Token exists, verify it
    let tokenVerified;
    try {
      tokenVerified = jwt.verify(token, process.env.A_TOKEN_SECRET);
    } catch (error) {
      console.error(`ERROR VERIFYING TOKEN`);
      console.error(error);
      res.clearCookie("aToken");
      return res.redirect("/auth/sign-in"); // ✅ Exit immediately
    }

    // Valid token & on auth route → already logged in, redirect
    if (tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/dashboard");
    }

    // Invalid token & not on auth route → redirect
    if (!tokenVerified && !authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    // At this point, token is valid and it's not an auth route → continue
    const admin = await require("../utils/getAdmin")(tokenVerified.id);

    if (!admin || Object.keys(admin).length === 0) {
      res.clearCookie("aToken");
      return res.redirect("/auth/sign-in");
    }

    // Set vars and move on
    req.admin = admin;
    res.locals.admin = admin;
    res.locals.isLoggedin = true;
    return next();
  } catch (error) {
    console.error(`UNEXPECTED ERROR IN AUTH MIDDLEWARE`);
    console.error(error);
    res.clearCookie("aToken");
    return res.redirect("/auth/sign-in");
  }
};
