const router = require("express").Router();
const preventDuplicateAdmin = require("../middlewares/preventDuplicatAdmin");

router.get("/sign-up", preventDuplicateAdmin, async (req, res) => {
  try {
    res.render("auth/signUp.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      classes: await require("../utils/getClasses")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING SIGNUP PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post(
  "/sign-up",
  preventDuplicateAdmin,
  require("../controllers/auth/signUp")
);

router.get("/sign-in", async (req, res) => {
  res.render("auth/signIn.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
  });
});
router.post("/sign-in", require("../controllers/auth/signIn"));

router.get("/logout", async (req, res) => {
  res.clearCookie("aToken");
  res.redirect("/auth/sign-in");
});

module.exports = router;
