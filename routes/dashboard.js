const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/dashboard.ejs", {
      studentCount: await require("../utils/getStudentCount")(),
      aspirantCount: await require("../utils/getAspirantCount")(),
      teacherCount: await require("../utils/getTeacherCount")(),
      newAspirants: await require("../utils/getAspirants")(
        5,
        "createdAt",
        "ASC"
      ),
    });
  } catch (error) {
    console.error("ERROR RENDERING DASHBOARD PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});

// All aspirants
router.get("/all-aspirants", async (req, res) => {
  try {
    const { Country, State } = require("country-state-city");
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/aspirant/allAspirants.ejs", {
      alert: req.flash("alert")[0] || "",
      academicYears: await require("../utils/getAcademicYears")(),
      religions: await require("../utils/getReligions")(),
      classes: await require("../utils/getClasses")(),
      countries: Country.getAllCountries(),
      states: State.getAllStates(),
      form: req.flash("form")[0] || "",
      newPassword: req.flash("newPassword")[0] || "",
      newPasswordFor: req.flash("newPasswordFor")[0] || "",
    });
  } catch (error) {
    console.error("ERROR RENDERING ALL ASPIRANTS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/all-aspirants", require("../controllers/dashboard/aspirant/"));
// Add aspirant
router.get("/add-aspirant", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("ERROR RENDERING ADD ASPIRANT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/add-aspirant", require("../controllers/dashboard/aspirant"));
// Aspirant
router.get("/aspirant/:id", async (req, res) => {
  try {
    const { Country, State } = require("country-state-city");
    const aspirant = await require("../utils/getAspirant")(req.params.id);
    if (Object.keys(aspirant).length === 0) {
      return res.status(404).render("error.ejs", { error: "" });
    }

    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/aspirant/aspirant.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      newStudentId: req.flash("newStudentId")[0] || "",
      aspirant: await require("../utils/getAspirant")(req.params.id),
      user: "",
      newPassword: req.flash("newPassword")[0] || "",
      academicYears: await require("../utils/getAcademicYears")(),
      countries: Country.getAllCountries(),
      states: State.getAllStates(),
      // currentCountryStates: State.getStatesOfCountry(aspirant.country) || [],
      religions: await require("../utils/getReligions")(),
      classes: await require("../utils/getClasses")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING ASPIRANT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/aspirant/:id", require("../controllers/dashboard/aspirant"));

// All students
router.get("/all-students", async (req, res) => {
  try {
    const { Country, State } = require("country-state-city");
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/student/allStudents.ejs", {
      alert: req.flash("alert")[0] || "",
      academicYears: await require("../utils/getAcademicYears")(),
      states: State.getAllStates(),
      religions: await require("../utils/getReligions")(),
      classes: await require("../utils/getClasses")(),
      countries: Country.getAllCountries(),
      states: State.getAllStates(),
      form: req.flash("form")[0] || "",
      newPassword: req.flash("newPassword")[0] || "",
      newPasswordFor: req.flash("newPasswordFor")[0] || "",
    });
  } catch (error) {
    console.error("ERROR RENDERING ALL STUDENTS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/all-students", require("../controllers/dashboard/student/"));
// Add student
router.get("/add-student", async (req, res) => {
  try {
    const { Country, State } = require("country-state-city");
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/student/addStudent.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      newStudent: req.flash("newStudent")[0] || "",
      newStudentId: req.flash("newStudentId")[0] || "",
      classes: await require("../utils/getClasses")(),
      religions: await require("../utils/getReligions")(),
      academicYears: await require("../utils/getAcademicYears")(),
      countries: Country.getAllCountries(),
      states: State.getAllStates(),
    });
  } catch (error) {
    console.error("ERROR RENDERING ADD STUDENT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/add-student", require("../controllers/dashboard/student"));
router.get("/student/:id", async (req, res) => {
  try {
    const { Country, State } = require("country-state-city");
    const student = await require("../utils/getStudent")(req.params.id);
    if (Object.keys(student).length === 0) {
      return res.status(404).render("error.ejs", { error: "" });
    }

    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/student/student.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      newPassword: req.flash("newPassword")[0] || "",
      student,
      academicYears: await require("../utils/getAcademicYears")(),
      user: "",
      countries: Country.getAllCountries(),
      states: State.getAllStates(),
      currentCountryStates: State.getStatesOfCountry(student.country) || [],
      religions: await require("../utils/getReligions")(),
      classes: await require("../utils/getClasses")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING STUDENT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/student/:id", require("../controllers/dashboard/student/"));

// Guardian
router.get("/all-guardians", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/guardian/allGuardians.ejs");
  } catch (error) {
    console.error("ERROR RENDERING ALL GUARDIANS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.get("/guardian/:id", async (req, res) => {
  try {
    const guardian = await require("../utils/getGuardian")(req.params.id);
    if (Object.keys(guardian).length === 0) {
      return res.status(404).render("error.ejs", { error: "" });
    }

    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/guardian/guardian.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      newStudentId: req.flash("newStudentId")[0] || "",
      guardian: await require("../utils/getGuardian")(req.params.id),
      user: "",
    });
  } catch (error) {
    console.error("ERROR RENDERING GUARDIAN PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});

// Add teacher
router.get("/all-teachers", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/teacher/allTeachers.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      teachers: await require("../utils/getTeachers")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING ALL TEACHERS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.get("/add-teacher", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("ERROR RENDERING ADD TEACHER PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.get("/teacher/:id", async (req, res) => {
  try {
    const teacher = await require("../utils/getTeacher")(req.params.id);
    if (Object.keys(teacher).length === 0) {
      return res.status(404).render("error.ejs", { error: "" });
    }

    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/teacher/teacher.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      teacher: await require("../utils/getTeacher")(req.params.id),
      user: "",
    });
  } catch (error) {
    console.error("ERROR RENDERING TEACHER PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/add-teacher", require("../controllers/dashboard/teacher"));

// Site settings
router.get("/site-settings", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/siteSettings.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
    });
  } catch (error) {
    console.error("ERROR RENDERING SITE SETTINGS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});

// class
router.get("/class", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/class/class.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      classes: await require("../utils/getClasses")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING CLASS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/class", require("../controllers/dashboard/class"));

// religion
router.get("/religion", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/religion/religion.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      religions: await require("../utils/getReligions")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING RELIGION PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/religion", require("../controllers/dashboard/religion"));

// Feature flags
router.get("/featureFlags", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/featureFlags/featureFlags.ejs", {
      featureFlags: await require("../utils/getFeatureFlags")(),
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
    });
    console.log(await require("../utils/getFeatureFlags")());
  } catch (error) {
    console.error("ERROR RENDERING DISABLED FEATURES PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/featureFlags", require("../controllers/dashboard/featureFlags"));

// Subject
router.get("/all-subjects", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/subject/allSubjects.ejs");
  } catch (error) {
    console.error("ERROR RENDERING ALL SUBJECTS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.get("/subject", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/subject/subject.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      classes: (await require("../utils/getClasses")()) || "",
      formSection: req.flash("formSection")[0] || "",
      subjects: await require("../utils/getSubjects")(false),
    });
  } catch (error) {
    console.error("ERROR RENDERING SUBJECT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/subject", require("../controllers/dashboard/subject"));

// Exam
router.get("/exam", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/exam/exam.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      subjects: await require("../utils/getSubjects")(false),
      formSection: req.flash("formSection")[0] || "",
      classes: await require("../utils/getClasses")(),
      academicYears: await require("../utils/getAcademicYearsWithTerms")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING EXAM PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/exam", require("../controllers/dashboard/exam"));

// Exam settings
router.get("/exam-settings", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/exam/examSettings.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      subjects: await require("../utils/getSubjects")(false),
      formSection: req.flash("formSection")[0] || "",
      examSettings: (await require("../utils/getExamSettings")()) || "",
    });
  } catch (error) {
    console.error("ERROR RENDERING EXAM SETTINGS PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/exam-settings", require("../controllers/dashboard/examSettings"));

// AcademicYear
router.get("/academic-year", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/academicYear/academicYear.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      academicYears: await require("../utils/getAcademicYears")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING ACADEMIC YEAR PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/academic-year", require("../controllers/dashboard/academicYear"));

// Term
router.get("/term", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/term/term.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      formSection: req.flash("formSection")[0] || "",
      academicYears: await require("../utils/getAcademicYears")(),
      terms: await require("../utils/getTerms")(),
    });
  } catch (error) {
    console.error("ERROR RENDERING TERM PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/term", require("../controllers/dashboard/term"));

// Result
router.get("/result", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    const term = await require("../utils/getTerm")(req.query.term);
    const academicYear = term?.AcademicYearId
      ? await require("../utils/getAcademicYearById")(term.AcademicYearId)
      : {};
    const student = await require("../utils/getStudent")(req.query.student);
    const viewResults = await require("../utils/getResults")(req.query.term, req.query.student);
    const stp = await require("../utils/getStudentTermPerformance")({
      termId: req.query.term,
      studentId: req.query.student,
    });
    const toOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"], v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    if (stp && stp.position) stp.position = toOrdinal(stp.position);
    const outOf = await require("../models").StudentTermPerformance.count({
      where: { ClassId: stp?.ClassId || student.ClassId, TermId: req.query.term },
    });
    res.status(status).render("dashboard/result/result.ejs", {
      alert: req.flash("alert")[0] || "",
      academicYears: await require("../utils/getAcademicYearsWithTerms")(),
      form: req.flash("form")[0] || "",
      selectedTerm: req.query.term,
      student,
      term,
      academicYear,
      results: viewResults,
      outOf,
      ...(await require("../utils/getStudentSubjects")(
        req.query.student,
        req.query.term
      )),
      getStudentTermPerformance: stp,
    });
  } catch (error) {
    console.error("ERROR RENDERING RESULT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/result", require("../controllers/dashboard/result"));

// CBT Result
router.get("/cbt-result", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    res.status(status).render("dashboard/cbtResult/cbtResult.ejs");
  } catch (error) {
    console.error("ERROR RENDERING CBT RESULT PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});

// Notification
router.get("/notification", async (req, res) => {
  try {
    const status = req.flash("status")[0] || 200;
    console.log(await require("../utils/getUsers")());
    res.status(status).render("dashboard/notification/notification.ejs", {
      alert: req.flash("alert")[0] || "",
      form: req.flash("form")[0] || "",
      users: await require("../utils/getUsers")(),
      formSection: req.flash("formSection")[0] || "",
    });
  } catch (error) {
    console.error("ERROR RENDERING NOTIFICATION PAGE");
    console.error(error);
    require("../utils/showErrorPage")(500, {}, res);
  }
});
router.post("/notification", require("../controllers/dashboard/notification"));

module.exports = router;
