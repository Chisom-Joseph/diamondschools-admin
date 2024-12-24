const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard/dashboard.ejs");
});

// Add student
router.get("/add-student", async (req, res) => {
  res.render("dashboard/student/addStudent.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: await require("../utils/getClass")(),
  });
});
router.post("/add-student", require("../controllers/dashboard/student"));

// class
router.get("/class", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  console.log(await require("../utils/genRegNumber")()),
    res.status(status).render("dashboard/class/class.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      classes: await require("../utils/genRegNumber")(),
    });
});
router.post("/class", require("../controllers/dashboard/class"));

module.exports = router;
