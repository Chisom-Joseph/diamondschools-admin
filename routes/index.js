const router = require("express").Router();

const loginVerifier = require("../middlewares/loginVerifire");

router.use(require("../middlewares/adminAvailable"));
router.use(require("../middlewares/setCurrentPath"));
router.use("/dashboard", loginVerifier, require("./dashboard"));
router.use("/auth", loginVerifier, require("./auth"));
router.use("/api", loginVerifier, require("./api"));

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("*", (req, res) => {
  res.status(404).render("error.ejs");
});

module.exports = router;
