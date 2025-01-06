const { Student } = require("../../models"); // Replace with your model
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
      ];

      const orderBy = order?.[0]
        ? [[columns[parseInt(order[0].column)], order[0].dir || "asc"]]
        : [["registrationNumber", "asc"]];

      // Fetch data with Sequelize
      const { count, rows } = await Student.findAndCountAll({
        where,
        order: orderBy,
        limit,
        offset,
        attibutes: [...columns, "ClassId", "GuardianId"],
      });

      const allRows = await Promise.all(
        rows.map(async (row) => {
          const currentRow = row.dataValues;
          currentRow.class =
            (await require("../../utils/getClass")(currentRow.ClassId)) || {};

          currentRow.guardian =
            (await require("../../utils/getGuardian")(currentRow.GuardianId)) ||
            {};

          return { ...currentRow, asdf: "asdf" };
        })
      );

      // Respond with data in DataTables format
      res.json({
        draw: parseInt(draw) || 0,
        recordsTotal: count,
        recordsFiltered: count,
        data: await allRows,
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
