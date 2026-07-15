const { Student, Class, Guardian } = require("../../models"); // Replace with your model
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { draw, start, length, search, order } = req.query;

    const page = parseInt(start) / parseInt(length) + 1; // Calculate page number
    const limit = parseInt(length) || 10; // Number of items per page
    const offset = parseInt(start) || 0; // Offset for items
    const searchValue = search?.value || ""; // Search term

    try {
      // Search and sort configuration
      const where = searchValue
        ? {
            [Op.or]: [
              { firstName: { [Op.like]: `%${searchValue}%` } },
              { middleName: { [Op.like]: `%${searchValue}%` } },
              { lastName: { [Op.like]: `%${searchValue}%` } },
              { registrationNumber: { [Op.like]: `%${searchValue}%` } },
              { gender: { [Op.like]: `%${searchValue}%` } },
              { dateOfBirth: { [Op.like]: `%${searchValue}%` } },
              { country: { [Op.like]: `%${searchValue}%` } },
              { stateOfOrigin: { [Op.like]: `%${searchValue}%` } },
              { religion: { [Op.like]: `%${searchValue}%` } },
            ],
          }
        : {};

      const columns = [
        "id",
        "firstName",
        "middleName",
        "lastName",
        "registrationNumber",
        "country",
        "stateOfOrigin",
        "profileImageUrl",
        "address",
        "religion",
        "gender",
        "dateOfBirth",
        "blocked",
        "deleted",
        "lastAccess",
        "AcademicYearId",
      ];

      const sortColumns = ["profileImageUrl", "firstName", "id", "registrationNumber", "gender", "id"];

      const orderBy = order?.[0]
        ? [[sortColumns[parseInt(order[0].column)] || "registrationNumber", order[0].dir || "asc"]]
        : [["registrationNumber", "asc"]];

      // Fetch data with Sequelize using JOINs
      const { count, rows } = await Student.findAndCountAll({
        where,
        order: orderBy,
        limit,
        offset,
        attributes: [...columns, "ClassId", "GuardianId"],
        include: [
          { model: Class, attributes: ["id", "name"] },
          { model: Guardian, attributes: ["id", "firstName", "middleName", "lastName", "email"] },
        ],
      });

      const allRows = rows.map((row) => {
        const studentObj = row.toJSON();
        studentObj.class = studentObj.Class || {};
        studentObj.guardian = studentObj.Guardian || {};
        delete studentObj.Class;
        delete studentObj.Guardian;
        return { ...studentObj, asdf: "asdf" };
      });

      // Respond with data in DataTables format
      res.json({
        draw: parseInt(draw) || 0,
        recordsTotal: count,
        recordsFiltered: count,
        data: allRows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
    }
  } catch (error) {
    console.log("ERROR GETTING STUDENTS");
    console.log(error);
  }
};
