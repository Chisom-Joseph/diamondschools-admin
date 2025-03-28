const { Aspirant } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const aspirantId = req.params.id || req.body.aspirantId;
    const aspirant = await Aspirant.findOne({ where: { id: aspirantId } });

    if (!aspirant) {
      req.flash("alert", {
        status: "error",
        section: "block",
        message: "Aspirant not found",
      });
      req.flash("status", 404);
      return res.redirect(req.baseUrl + req.path);
    }

    const newBlockedStatus = !aspirant.blocked; // Toggle status

    await Aspirant.update(
      { blocked: newBlockedStatus },
      { where: { id: aspirantId } }
    );

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Aspirant ${
        req.body.aspirantId ? aspirant.registrationNumber : ""
      } ${newBlockedStatus ? "blocked" : "unblocked"} successfully`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    res.redirect(req.baseUrl + req.path);
  } catch (error) {
    console.error(error);
    console.error("ERROR BLOCKING ASPIRANT");
    req.flash("alert", {
      status: "error",
      section: "block",
      message: "Something went wrong",
    });
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
