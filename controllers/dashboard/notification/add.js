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

    // const existingNotification = await UserNotification.findOne({
    //   where: {
    //     StudentId: studentId,
    //     NotificationId: notificationId,
    //   },
    // });

    // if (!existingNotification) {
    // }

    // Fetch students and aspirants if they are selected
    if (users.includes("student")) {
      const students = await Student.findAll();
      for (let student of students) {
        await UserNotification.create({
          StudentId: student.id, // Foreign Key matching capitalized StudentId
          NotificationId: notification.id, // Foreign Key to Notification's UUID
          // userType: "student",
        });
      }
    }

    if (users.includes("aspirant")) {
      const aspirants = await Aspirant.findAll();
      for (let aspirant of aspirants) {
        await UserNotification.create({
          AspirantId: aspirant.id, // Foreign Key matching capitalized AspirantId
          NotificationId: notification.id, // Foreign Key to Notification's UUID
          // userType: "aspirant",
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
