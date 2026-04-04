const { SiteSettings } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      keywords,
      email,
      address,
      phone1,
      phone2,
      phone3,
      favicon,
      logo,
      logoLight,
    } = req.body;

    // Basic validation
    if (!name || !email || !address || !phone1) {
      req.flash("alert", {
        status: "error",
        section: "site_settings",
        message: "Name, Email, Address, and Phone are required fields.",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/site-settings");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("alert", {
        status: "error",
        section: "site_settings",
        message: "Please provide a valid email address.",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/site-settings");
    }

    await SiteSettings.upsert({
      name,
      title: title || name,
      description,
      keywords,
      email,
      address,
      phone1,
      phone2,
      phone3,
      favicon,
      logo,
      logoLight,
      uniqueKey: 1,
    });

    req.flash("alert", {
      status: "success",
      section: "site_settings",
      message: "Site settings updated successfully.",
    });
    req.flash("form", "");
    req.flash("status", 200);
    return res.redirect("/dashboard/site-settings");
  } catch (error) {
    console.error("Error updating site settings:", error);
    req.flash("alert", {
      status: "error",
      section: "site_settings",
      message: "Something went wrong, please try again",
    });
    req.flash("form", req.body);
    req.flash("status", 500);
    return res.redirect("/dashboard/site-settings");
  }
};
