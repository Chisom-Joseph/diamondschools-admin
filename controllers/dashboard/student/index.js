module.exports = (req, res) => {
  switch (req.query.action) {
    case "add":
      require("./add")(req, res);
      break;
    case "edit-student-info":
      require("./editStudentInfo")(req, res);
      break;
    case "edit-student-photo":
      require("./editStudentPhoto")(req, res);
      break;
    case "reset-student-password":
      require("./resetStudentPassword")(req, res);
      break;
    case "block-student":
      require("./blockStudent")(req, res);
      break;
    case "delete":
      require("./delete")(req, res);
      break;
    default:
      req.flash("alert", {
        status: "error",
        section: "update",
        message: "Something went wrong",
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect(req.baseUrl + req.path);
  }
};
