module.exports = (req, res) => {
  switch (req.query.action) {
    case "add":
      require("./add")(req, res);
      break;
    case "update":
      require("./update")(req, res);
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
      req.flash("formSection", `${req.query.action}`);
      req.flash("status", 400);
      return res.redirect("/dashboard/term");
  }
};
