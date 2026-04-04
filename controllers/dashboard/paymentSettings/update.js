const paymentSettingsSchema = require("../../../validation/paymentSettings/update");
const { PaymentSettings } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const {
      description,
      amount,
      accountNumber,
      accountName,
      bankName,
      accountType,
    } = req.body;

    // Validate payment settings
    const valid = paymentSettingsSchema.validate(req.body);
    if (valid.error) {
      req.flash("alert", {
        status: "error",
        section: "payment_settings",
        message: valid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/site-settings");
    }

    await PaymentSettings.upsert({
      description,
      amount,
      accountNumber,
      accountName,
      bankName,
      accountType,
      uniqueKey: 1,
    });

    req.flash("alert", {
      status: "success",
      section: "payment_settings",
      message: "Payment information updated successfully.",
    });
    req.flash("form", "");
    req.flash("status", 200);
    return res.redirect("/dashboard/site-settings");
  } catch (error) {
    console.error("Error updating payment settings:", error);
    req.flash("alert", {
      status: "error",
      section: "payment_settings",
      message: "Something went wrong, please try again",
    });
    req.flash("form", req.body);
    req.flash("status", 500);
    return res.redirect("/dashboard/site-settings");
  }
};
