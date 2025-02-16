const router = require("express").Router();

// Aspirants
router.get("/get-aspirants", require("../controllers/api/getAspirants"));

// Students
router.get("/get-students", require("../controllers/api/getStudents"));

// Guardians
router.get("/get-guardians", require("../controllers/api/getGuardians"));

// Teachers
router.get("/get-teachers", require("../controllers/api/getTeachers"));

// Subject and classes
router.get(
  "/get-subject-and-classes/:id",
  require(`../controllers/api/getSubjectAndClass`)
);

// Subjectss
router.get("/get-subjects", require(`../controllers/api/getSubjects`));

// Academic years
router.get(
  "/get-academic-year/:id",
  require(`../controllers/api/getAcademicYears`)
);

module.exports = router;
