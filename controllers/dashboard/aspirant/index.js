module.exports = (req, res) => {
  switch (req.query.action) {
    case "add":
      require("./add")(req, res);
      break;
    case "edit-aspirant-info":
      require("./editAspirantInfo")(req, res);
      break;
    case "edit-aspirant-photo":
      require("./editAspirantPhoto")(req, res);
      break;
    case "reset-aspirant-password":
      require("./resetAspirantPassword")(req, res);
      break;
    case "block-aspirant":
      require("./blockAspirant")(req, res);
      break;
    case "delete-aspirant":
      require("./deleteAspirant")(req, res);
      break;
    case "make-student":
      require("./makeStudent")(req, res);
      break;
    default:
      console.error("ERROR FINDING ASPIRANT CONTROLLER");
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
