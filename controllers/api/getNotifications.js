const { Notification, Student, Aspirant, Teacher, Class } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { draw, start, length, search, order } = req.query;

    const limit = parseInt(length) || 10;
    const offset = parseInt(start) || 0;
    const searchValue = search?.value || "";

    const audienceLabels = {
      'all-students': 'All Students',
      'all-aspirants': 'All Aspirants',
      'all-teachers': 'All Teachers',
      'specific-students': 'Specific Students',
      'specific-aspirants': 'Specific Aspirants',
      'specific-teachers': 'Specific Teachers'
    };

    // Search configuration
    const where = searchValue
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${searchValue}%` } },
            { message: { [Op.like]: `%${searchValue}%` } },
            { targetAudience: { [Op.like]: `%${searchValue}%` } },
          ],
        }
      : {};

    // Columns for sorting
    const columns = ["id", "title", "message", "targetAudience", "createdAt"];

    const orderBy = order?.[0]
      ? [[columns[parseInt(order[0].column)], order[0].dir || "desc"]]
      : [["createdAt", "desc"]];

    // Fetch data with Sequelize
    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: orderBy,
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "middleName", "lastName", "registrationNumber"],
          through: { attributes: ["seen"] },
          include: [{ model: Class, attributes: ["name"] }],
        },
        {
          model: Aspirant,
          attributes: ["id", "firstName", "middleName", "lastName", "examinationNumber"],
          through: { attributes: ["seen"] },
          include: [{ model: Class, attributes: ["name"] }],
        },
        {
          model: Teacher,
          attributes: ["id", "firstName", "lastName", "email"],
          through: { attributes: ["seen"] },
        },
      ],
    });

    // Transform data for DataTables
    const data = rows.map((notification) => {
      const students = notification.Students || [];
      const aspirants = notification.Aspirants || [];
      const teachers = notification.Teachers || [];
      const recipientCount = students.length + aspirants.length + teachers.length;
      const isSpecific = notification.targetAudience && notification.targetAudience.startsWith('specific-');
      
      // Calculate view statistics
      const viewedStudents = students.filter(s => s.UserNotification?.seen === true);
      const viewedAspirants = aspirants.filter(a => a.UserNotification?.seen === true);
      const viewedTeachers = teachers.filter(t => t.UserNotification?.seen === true);
      const viewedCount = viewedStudents.length + viewedAspirants.length + viewedTeachers.length;

      return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        targetAudience: notification.targetAudience,
        audienceLabel: audienceLabels[notification.targetAudience] || 'Legacy',
        isSpecific,
        recipientCount,
        viewedCount,
        students: students.map(s => ({
          firstName: s.firstName,
          middleName: s.middleName,
          lastName: s.lastName,
          className: s.Class?.name,
          seen: s.UserNotification?.seen || false
        })),
        aspirants: aspirants.map(a => ({
          firstName: a.firstName,
          middleName: a.middleName,
          lastName: a.lastName,
          className: a.Class?.name,
          seen: a.UserNotification?.seen || false
        })),
        teachers: teachers.map(t => ({
          firstName: t.firstName,
          lastName: t.lastName,
          email: t.email,
          seen: t.UserNotification?.seen || false
        })),
        createdAt: notification.createdAt,
      };
    });

    // Respond with data in DataTables format
    res.json({
      draw: parseInt(draw) || 0,
      recordsTotal: count,
      recordsFiltered: count,
      data,
    });
  } catch (error) {
    console.error("ERROR GETTING NOTIFICATIONS");
    console.error(error);
    res.status(500).json({
      draw: parseInt(req.query.draw) || 0,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: [],
      error: "Error fetching notifications",
    });
  }
};
