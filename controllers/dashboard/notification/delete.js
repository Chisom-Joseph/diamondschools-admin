const deleteNotificationSchema = require("../../../validation/notification/delete");
const { Notification } = require("../../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    // Normalize notifications to array
    let notificationIds = req.body.notifications;
    if (notificationIds && !Array.isArray(notificationIds)) {
      notificationIds = [notificationIds];
    }
    req.body.notifications = notificationIds;

    // Validate notifications
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

    // Check how many notifications exist
    const existingNotifications = await Notification.findAll({
      where: { id: { [Op.in]: notificationIds } },
    });

    if (existingNotifications.length === 0) {
      req.flash("alert", {
        status: "error",
        section: "delete",
        message: "Selected notification(s) do not exist.",
      });
      req.flash("form", req.body);
      req.flash("formSection", "delete");
      req.flash("status", 400);
      return res.redirect("/dashboard/notification");
    }

    const existingIds = existingNotifications.map((n) => n.id);
    const deletedCount = existingIds.length;

    // Delete notifications (CASCADE handles UserNotification cleanup)
    await Notification.destroy({
      where: { id: { [Op.in]: existingIds } },
    });

    const message =
      deletedCount === 1
        ? "Notification deleted successfully."
        : `${deletedCount} notifications deleted successfully.`;

    req.flash("alert", {
      status: "success",
      section: "delete",
      message: message,
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
      message: "There was an error deleting the notification(s).",
    });
    req.flash("form", req.body);
    req.flash("formSection", "delete");
    req.flash("status", 500);
    return res.redirect("/dashboard/notification");
  }
};
