const router = require("express").Router();

router.get("/", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/dashboard.ejs", {
    studentCount: await require("../utils/getStudentCount")(),
    aspirantCount: await require("../utils/getAspirantCount")(),
    teacherCount: await require("../utils/getTeacherCount")(),
    newAspirants: await require("../utils/getAspirants")(5, "createdAt", "ASC"),
  });
});

// All aspirants
router.get("/all-aspirants", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/allAspirants.ejs");
});
// Add aspirant
router.get("/add-aspirant", async (req, res) => {
  const { Country, State } = require("country-state-city");
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/addAspirant.ejs", {
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
  const aspirant = await require("../utils/getAspirant")(req.params.id);
  if (Object.keys(aspirant).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/aspirant.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    aspirant: await require("../utils/getAspirant")(req.params.id),
    user: "",
  });
});
router.post("/aspirant/:id", require("../controllers/dashboard/aspirant"));

// All students
router.get("/all-students", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/allStudents.ejs");
});
// Add student
router.get("/add-student", async (req, res) => {
  const { Country, State } = require("country-state-city");
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/addStudent.ejs", {
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
  const student = await require("../utils/getStudent")(req.params.id);
  if (Object.keys(student).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/student.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    student: await require("../utils/getStudent")(req.params.id),
    user: "",
  });
});
router.post("/student/:id", require("../controllers/dashboard/student/"));

// Guardian
router.get("/all-guardians", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/guardian/allGuardians.ejs");
});
router.get("/guardian/:id", async (req, res) => {
  const guardian = await require("../utils/getGuardian")(req.params.id);
  if (Object.keys(guardian).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/guardian/guardian.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    guardian: await require("../utils/getGuardian")(req.params.id),
    user: "",
  });
});

// Add teacher
router.get("/all-teachers", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/teacher/allTeachers.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    teachers: await require("../utils/getTeachers")(),
  });
});
router.get("/add-teacher", async (req, res) => {
  const { Country, State } = require("country-state-city");
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/teacher/addTeacher.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newTeacherId: req.flash("newTeacherId")[0] || "",
    religions: await require("../utils/getReligions")(),
    countries: Country.getAllCountries(),
    states: State.getAllStates(),
  });
});
router.get("/teacher/:id", async (req, res) => {
  const teacher = await require("../utils/getTeacher")(req.params.id);
  if (Object.keys(teacher).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/teacher/teacher.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    teacher: await require("../utils/getTeacher")(req.params.id),
    user: "",
  });
});
router.post("/add-teacher", require("../controllers/dashboard/teacher"));

// Site settings
router.get("/site-settings", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/siteSettings.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
  });
});

// class
router.get("/class", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/class/class.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    formSection: req.flash("formSection")[0] || "",
    classes: await require("../utils/getClasses")(),
  });
});
router.post("/class", require("../controllers/dashboard/class"));

// religion
router.get("/religion", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/religion/religion.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    formSection: req.flash("formSection")[0] || "",
    religions: await require("../utils/getReligions")(),
  });
});
router.post("/religion", require("../controllers/dashboard/religion"));

// Disabled features
router.get("/disabled-features", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/disabledFeature/disabledFeatures.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
  });
});

// Subject
router.get("/all-subjects", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/subject/allSubjects.ejs");
});
router.get("/subject", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/subject/subject.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: (await require("../utils/getClasses")()) || "",
    formSection: req.flash("formSection")[0] || "",
    subjects: await require("../utils/getSubjects")(false),
  });
});
router.post("/subject", require("../controllers/dashboard/subject"));

// Exam
router.get("/exam", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/exam/exam.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    subjects: await require("../utils/getSubjects")(false),
    formSection: req.flash("formSection")[0] || "",
    classes: await require("../utils/getClasses")(),
    academicYears: await require("../utils/getAcademicYearsWithTerms")(),
  });
});
router.post("/exam", require("../controllers/dashboard/exam"));

// Exam settings
router.get("/exam-settings", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/exam/examSettings.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    subjects: await require("../utils/getSubjects")(false),
    formSection: req.flash("formSection")[0] || "",
    examSettings: (await require("../utils/getExamSettings")()) || "",
  });
});
router.post("/exam-settings", require("../controllers/dashboard/examSettings"));

// AcademicYear
router.get("/academic-year", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/academicYear/academicYear.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    formSection: req.flash("formSection")[0] || "",
    academicYears: await require("../utils/getAcademicYears")(),
  });
});
router.post("/academic-year", require("../controllers/dashboard/academicYear"));

// Term
router.get("/term", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/term/term.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    formSection: req.flash("formSection")[0] || "",
    academicYears: await require("../utils/getAcademicYears")(),
    terms: await require("../utils/getTerms")(),
  });
});
router.post("/term", require("../controllers/dashboard/term"));

// Result
router.get("/result", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/result/result.ejs", {
    alert: req.flash("alert")[0] || "",
    academicYears: await require("../utils/getAcademicYearsWithTerms")(),
    form: req.flash("form")[0] || "",
    selectedTerm: req.query.term,
    ...(await require("../utils/getStudentSubjects")(
      req.query.student,
      req.query.term
    )),
    getStudentTermPerformance:
      await require("../utils/getStudentTermPerformance")({
        termId: req.query.term,
        studentId: req.query.student,
      }),
  });
});
router.post("/result", require("../controllers/dashboard/result"));

// CBT Result
router.get("/cbt-result", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/cbtResult/cbtResult.ejs");
});

// Notification
router.get("/notification", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  console.log(await require("../utils/getUsers")());
  res.status(status).render("dashboard/notification/notification.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    users: await require("../utils/getUsers")(),
    formSection: req.flash("formSection")[0] || "",
  });
});
router.post("/notification", require("../controllers/dashboard/notification"));

module.exports = router;
