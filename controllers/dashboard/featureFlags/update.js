const updateFeatureAccess = require("../../../utils/updateFeatureAccess");

module.exports = async (req, res) => {
  try {
    const { featureFlagId, featureName, userGroup } = req.body;
    const featureUdated = await updateFeatureAccess(
      featureFlagId,
      featureName,
      userGroup,
      null,
      true
    );
    console.log(featureUdated);

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Feature updated successfully",
    });
    req.flash("form", "");
    req.flash("formSection", "add");
    req.flash("status", 200);
    return res.redirect("/dashboard/featureFlags");
  } catch (error) {
    console.error("ERROR UPDATING FEATURE FLAGS");
    console.error(error);
  }
};
