const router = require("express").Router();

const loginVerifier = require("../middlewares/loginVerifire");

router.use(require("../middlewares/adminAvailable"));
router.use(require("../middlewares/setCurrentPath"));
router.use("/dashboard", loginVerifier, require("./dashboard"));
router.use("/auth", loginVerifier, require("./auth"));

router.get("/", (req, res) => {
  // res.redirect("/dashboard");
  res.redirect("/dashboard/all-students");
});

router.get("*", (req, res) => {
  res.render("error.ejs");
});

module.exports = router;
