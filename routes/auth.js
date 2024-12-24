const router = require("express").Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/signUp.ejs", {
    error: "",
    form: "",
  });
});
router.post("/sign-up", require("../controllers/auth/signUp"));

router.get("/sign-in", (req, res) => {
  res.render("auth/signIn.ejs", {
    error: "",
    form: "",
  });
});

module.exports = router;
