const { AttemptedSubject, Student, Subject, Term } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { draw, start, length, search, order } = req.query;

    const page = parseInt(start) / parseInt(length) + 1; // Calculate page number
    const limit = parseInt(length) || 10; // Number of items per page
    const offset = parseInt(start) || 0; // Offset for items
    const searchValue = search?.value || ""; // Search term

    // Define searchable fields
    const where = searchValue
      ? {
          [Op.or]: [
            { "$Student.firstName$": { [Op.like]: `%${searchValue}%` } },
            { "$Student.lastName$": { [Op.like]: `%${searchValue}%` } },
            {
              "$Student.registrationNumber$": { [Op.like]: `%${searchValue}%` },
            },
            { "$Subject.name$": { [Op.like]: `%${searchValue}%` } },
            { "$Term.name$": { [Op.like]: `%${searchValue}%` } },
          ],
        }
      : {};

    // Define columns for sorting
    const columns = [
      "id",
      "correctCount",
      "totalQuestions",
      "scorePercentage",
      "totalAnswered",
    ];

    // Set default sorting
    const orderBy = order?.[0]
      ? [[columns[parseInt(order[0].column)], order[0].dir || "asc"]]
      : [["id", "desc"]];

    // Fetch attempted subjects
    const { count, rows } = await AttemptedSubject.findAndCountAll({
      where,
      order: orderBy,
      limit,
      offset,
      attributes: [...columns, "StudentId", "SubjectId", "TermId"],
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "lastName", "registrationNumber"],
        },
        {
          model: Subject,
          attributes: ["id", "name"],
        },
        {
          model: Term,
          attributes: ["id", "name"],
        },
      ],
    });

    // Process rows to add student, subject, and term names
    const allRows = rows.map((row) => ({
      id: row.id,
      studentName: `${row.Student.firstName} ${row.Student.lastName}`,
      registrationNumber: row.Student.registrationNumber,
      subject: row.Subject.name,
      term: row.Term.name,
      correctCount: row.correctCount,
      totalQuestions: row.totalQuestions,
      scorePercentage: row.scorePercentage,
      totalAnswered: row.totalAnswered,
    }));

    // Respond with DataTables format
    res.json({
      draw: parseInt(draw) || 0,
      recordsTotal: count,
      recordsFiltered: count,
      data: allRows,
    });
  } catch (error) {
    console.error("Error fetching attempted subjects:", error);
    res.status(500).send("Error fetching data");
  }
};
