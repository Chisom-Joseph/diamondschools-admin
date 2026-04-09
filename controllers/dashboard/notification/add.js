const addNotificationSchema = require("../../../validation/notification/add");
const {
  Notification,
  UserNotification,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { title, message, userType } = req.body;
    let userIds = req.body.userIds;

    // Normalize userIds to array when present and deduplicate
    if (userIds && !Array.isArray(userIds)) {
      userIds = [userIds];
    }
    if (Array.isArray(userIds)) {
      userIds = [...new Set(userIds)];
    }
    req.body.userIds = userIds;

    // Validate notification
    const notificationValid = addNotificationSchema.validate(req.body);
    if (notificationValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: notificationValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/notification");
    }

    // Create notification with targetAudience
    const notification = await Notification.create({
      title,
      message,
      targetAudience: userType,
    });

    // For broadcast types (all-*), no UserNotification rows needed.
    // For specific types, create individual UserNotification rows.
    if (userType === "specific-students") {
      for (let studentId of userIds) {
        await UserNotification.findOrCreate({
          where: { StudentId: studentId, NotificationId: notification.id },
          defaults: { seen: false },
        });
      }
    }

    if (userType === "specific-aspirants") {
      for (let aspirantId of userIds) {
        await UserNotification.findOrCreate({
          where: { AspirantId: aspirantId, NotificationId: notification.id },
          defaults: { seen: false },
        });
      }
    }

    if (userType === "specific-teachers") {
      for (let teacherId of userIds) {
        await UserNotification.findOrCreate({
          where: { TeacherId: teacherId, NotificationId: notification.id },
          defaults: { seen: false },
        });
      }
    }

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Notification added successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "add");
    req.flash("status", 200);
    return res.redirect("/dashboard/notification");
  } catch (error) {
    console.log(error);
    req.flash("alert", {
      status: "error",
      section: "add",
      message: "There was an error adding the notification.",
    });
    req.flash("form", req.body);
    req.flash("formSection", "add");
    req.flash("status", 500);
    return res.redirect("/dashboard/notification");
  }
};
