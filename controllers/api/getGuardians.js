const { Guardian } = require("../../models"); // Replace with your model
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { draw, start, length, search, order } = req.query;

    const page = parseInt(start) / parseInt(length) + 1;
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
              { email: { [Op.like]: `%${searchValue}%` } },
              { gender: { [Op.like]: `%${searchValue}%` } },
              { phoneNumber: { [Op.like]: `%${searchValue}%` } },
              { occupation: { [Op.like]: `%${searchValue}%` } },
              { address: { [Op.like]: `%${searchValue}%` } },
              { relationshipToStudent: { [Op.like]: `%${searchValue}%` } },
            ],
          }
        : {};

      const columns = [
        "id",
        "firstName",
        "middleName",
        "lastName",
        "email",
        "address",
        "phoneNumber",
        "relationshipToStudent",
        "occupation",
        "address",
        "deleted",
      ];

      const orderBy = order?.[0]
        ? [[columns[parseInt(order[0].column)], order[0].dir || "asc"]]
        : [["id", "asc"]];

      // Fetch data with Sequelize
      const { count, rows } = await Guardian.findAndCountAll({
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
        data: await rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
    }
  } catch (error) {
    console.log("ERROR GETTING GUARDIANS");
    console.log(error);
  }
};
