module.exports = (req, res) => {
  switch (req.body.form) {
    case "results":
      require("./result")(req, res);
      break;
    case "remarks":
      require("./remarks")(req, res);
      break;
    case "termPerformance":
      require("./termPerformance")(req, res);
      break;
    default:
      req.flash("alert", {
        status: "error",
        section: "update",
        message: "Something went wrong",
      });
      req.flash("form", req.body);
      req.flash(
        "formSection",
        `${req.body.form === "results" ? "results" : "remarks"}`
      );
      req.flash("status", 400);
      return res.redirect(req.originalUrl);
  }
};
