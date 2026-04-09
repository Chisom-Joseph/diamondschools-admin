const { Notification } = require("../models");

module.exports = async () => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["id", "title", "targetAudience"],
    });
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};
