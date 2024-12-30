const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard/dashboard.ejs");
});

// All students
router.get("/all-students", async (req, res) => {
  res.render("dashboard/student/allStudents.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    students: await require("../utils/getStudents")(),
  });
});

// Add student
router.get("/add-student", async (req, res) => {
  res.render("dashboard/student/addStudent.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: await require("../utils/getClasses")(),
  });
});
router.post("/add-student", require("../controllers/dashboard/student"));

// Site settings
router.get("/site-settings", async (req, res) => {
  res.render("dashboard/siteSettings.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: await require("../utils/getClasses")(),
  });
});

// class
router.get("/class", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  console.log(await require("../utils/genRegNumber")()),
    res.status(status).render("dashboard/class/class.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      classes: await require("../utils/getClasses")(),
    });
});
router.post("/class", require("../controllers/dashboard/class"));

// class
router.get("/religion", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  console.log(await require("../utils/genRegNumber")()),
    res.status(status).render("dashboard/religion/religion.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      religions: await require("../utils/getReligions")(),
    });
});
router.post("/religion", require("../controllers/dashboard/religion"));

module.exports = router;
