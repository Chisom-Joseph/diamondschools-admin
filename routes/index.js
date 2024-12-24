const router = require("express").Router();

router.use("/dashboard", require("./dashboard"));
router.use("/auth", require("./auth"));

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("*", (req, res) => {
  res.render("error.ejs");
});

module.exports = router;
