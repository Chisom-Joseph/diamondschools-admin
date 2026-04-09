const { Notification, Student, Aspirant, Teacher, Class } = require("../models");

module.exports = async (page = 1, limit = 10) => {
  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const { count, rows: notifications } = await Notification.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset: offset,
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

    const totalPages = Math.ceil(count / limitNum);

    return {
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: limitNum,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notifications: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(limit),
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
};
