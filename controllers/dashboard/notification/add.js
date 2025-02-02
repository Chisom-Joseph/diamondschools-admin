const addNotificationSchema = require("../../../validation/notification/add");
const {
  Notification,
  UserNotification,
  Student,
  Aspirant,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { title, message, users } = req.body;

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

    // Create notification
    const notification = await Notification.create({ title, message });

    // Fetch students and aspirants if they are selected
    if (users.includes("student")) {
      const students = await Student.findAll();
      for (let student of students) {
        const existingEntry = await UserNotification.findOne({
          where: {
            StudentId: student.id,
            NotificationId: notification.id,
          },
        });

        if (!existingEntry) {
          await UserNotification.create({
            StudentId: student.id,
            NotificationId: notification.id,
          });
        }
      }
    }

    if (users.includes("aspirant")) {
      const aspirants = await Aspirant.findAll();
      for (let aspirant of aspirants) {
        const existingEntry = await UserNotification.findOne({
          where: {
            AspirantId: aspirant.id,
            NotificationId: notification.id,
          },
        });

        if (!existingEntry) {
          await UserNotification.create({
            AspirantId: aspirant.id,
            NotificationId: notification.id,
          });
        }
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
