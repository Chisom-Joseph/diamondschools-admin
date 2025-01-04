const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard/dashboard.ejs");
});

// All aspirants
router.get("/all-aspirants", async (req, res) => {
  res.render("dashboard/aspirant/allAspirants.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    aspirants: await require("../utils/getAspirants")(),
  });
});
// Add aspirant
router.get("/add-aspirant", async (req, res) => {
  const { Country, State } = require("country-state-city");
  res.render("dashboard/aspirant/addAspirant.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newAspirantId: req.flash("newAspirantId")[0] || "",
    classes: await require("../utils/getClasses")(),
    religions: await require("../utils/getReligions")(),
    examinationDate: await require("../utils/getExaminationDate")(),
    academicYears: await require("../utils/getAcademicYears")(),
    countries: Country.getAllCountries(),
    states: State.getAllStates(),
  });
});
router.post("/add-aspirant", require("../controllers/dashboard/aspirant"));
// Aspirant
router.get("/aspirant/:id", async (req, res) => {
  res.render("dashboard/aspirant/aspirant.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newAspirantId: req.flash("newAspirantId")[0] || "",
    aspirant: await require("../utils/getAspirant")(req.params.id),
    user: "",
  });
});
router.post("/aspirant/:id", require("../controllers/dashboard/aspirant"));

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
  const { Country, State } = require("country-state-city");
  res.render("dashboard/student/addStudent.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    classes: await require("../utils/getClasses")(),
    religions: await require("../utils/getReligions")(),
    examinationDate: await require("../utils/getExaminationDate")(),
    academicYears: await require("../utils/getAcademicYears")(),
    countries: Country.getAllCountries(),
    states: State.getAllStates(),
  });
});
router.post("/add-student", require("../controllers/dashboard/student"));
router.get("/student/:id", async (req, res) => {
  res.render("dashboard/student/student.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    student: await require("../utils/getStudent")(req.params.id),
    user: "",
  });
});
router.post("/student/:id", require("../controllers/dashboard/student/"));

// Guardian
router.get("/all-guardians", async (req, res) => {
  res.render("dashboard/guardian/allGuardians.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    guardians: await require("../utils/getGuardians")(),
  });
});
router.get("/guardian/:id", async (req, res) => {
  res.render("dashboard/guardian/guardian.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    guardian: await require("../utils/getGuardian")(req.params.id),
    user: "",
  });
});

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
