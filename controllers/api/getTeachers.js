const { Teacher } = require("../../models"); // Replace with your model
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { draw, start, length, search, order } = req.query;

    const limit = parseInt(length) || 10;
    const offset = parseInt(start) || 0;
    const searchValue = search?.value || "";

    try {
      // Search and sort configuration
      const where = searchValue
        ? {
            [Op.or]: [
              { firstName: { [Op.like]: `%${searchValue}%` } },
              { middleName: { [Op.like]: `%${searchValue}%` } },
              { lastName: { [Op.like]: `%${searchValue}%` } },
              { gender: { [Op.like]: `%${searchValue}%` } },
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
        "country",
        "stateOfOrigin",
        "address",
        "religion",
        "gender",
        "blocked",
        "deleted",
        "lastAccess",
      ];

      const orderBy = order?.[0]
        ? [[columns[parseInt(order[0].column)], order[0].dir || "asc"]]
        : [["id", "asc"]];

      // Fetch data with Sequelize
      const { count, rows } = await Teacher.findAndCountAll({
        where,
        order: orderBy,
        limit,
        offset,
        attibutes: [...columns],
      });

      // Respond with data in DataTables format
      res.json({
        draw: parseInt(draw) || 0,
        recordsTotal: count,
        recordsFiltered: count,
        data: rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
    }
  } catch (error) {
    console.log("ERROR GETTING TEACHERS");
    console.log(error);
  }
};
