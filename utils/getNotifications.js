const { Notification } = require("../models");

module.exports = async () => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};
