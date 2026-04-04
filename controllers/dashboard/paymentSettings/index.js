module.exports = (req, res) => {
  switch (req.query.action) {
    case "update":
      require("./update")(req, res);
      break;
    default:
      req.flash("alert", {
        status: "error",
        message: "Something went wrong",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/site-settings");
  }
};
