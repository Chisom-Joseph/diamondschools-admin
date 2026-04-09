const deleteNotificationSchema = require("../../../validation/notification/delete");
const { Notification } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate notification
    const notificationValid = deleteNotificationSchema.validate(req.body);
    if (notificationValid.error) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: notificationValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/notification");
    }

    // Check if notification exists
    const notificationExists = await Notification.findOne({
      where: { id: req.body.notification },
    });
    if (!notificationExists) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: "Notification does not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/notification");
    }

    // Delete notification (CASCADE handles UserNotification cleanup)
    await Notification.destroy({
      where: { id: req.body.notification },
    });

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: "Notification deleted successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "");
    req.flash("status", 200);
    res.redirect("/dashboard/notification");
  } catch (error) {
    console.log(error);
    req.flash("alert", {
      status: "error",
      section: "delete",
      message: "There was an error deleting the notification.",
    });
    req.flash("form", req.body);
    req.flash("formSection", "delete");
    req.flash("status", 500);
    return res.redirect("/dashboard/notification");
  }
};
