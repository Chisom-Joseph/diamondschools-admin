const { Subject } = require("../../models"); // Replace with your model
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
              { Name: { [Op.like]: `%${searchValue}%` } },
              { shortName: { [Op.like]: `%${searchValue}%` } },
            ],
          }
        : {};

      const columns = ["id", "Name", "shortName", "ClassId", "deleted"];

      const orderBy = order?.[0]
        ? [[columns[parseInt(order[0].column)], order[0].dir || "asc"]]
        : [["id", "asc"]];

      // Fetch data with Sequelize
      const { count, rows } = await Subject.findAndCountAll({
        where,
        order: orderBy,
        limit,
        offset,
        attibutes: [...columns, "ClassId"],
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
    console.log("ERROR GETTING ASPIRANTS");
    console.log(error);
  }
};
