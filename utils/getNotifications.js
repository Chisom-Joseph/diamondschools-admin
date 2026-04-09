const { Notification, Student, Aspirant, Teacher, Class } = require("../models");

module.exports = async () => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "middleName", "lastName", "registrationNumber"],
          through: { attributes: [] },
          include: [{ model: Class, attributes: ["name"] }],
        },
        {
          model: Aspirant,
          attributes: ["id", "firstName", "middleName", "lastName", "examinationNumber"],
          through: { attributes: [] },
          include: [{ model: Class, attributes: ["name"] }],
        },
        {
          model: Teacher,
          attributes: ["id", "firstName", "lastName", "email"],
          through: { attributes: [] },
        },
      ],
    });
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};
