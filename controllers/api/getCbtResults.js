const {
  AttemptedSubject,
  Student,
  Aspirant,
  Subject,
  Term,
} = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { draw, start, length, search, order } = req.query;

    const page = parseInt(start) / parseInt(length) + 1;
    const limit = parseInt(length) || 10;
    const offset = parseInt(start) || 0;
    const searchValue = search?.value || "";

    // Define searchable fields for both Student and Aspirant
    const where = searchValue
      ? {
          [Op.or]: [
            { "$Student.firstName$": { [Op.like]: `%${searchValue}%` } },
            { "$Student.lastName$": { [Op.like]: `%${searchValue}%` } },
            {
              "$Student.registrationNumber$": { [Op.like]: `%${searchValue}%` },
            },
            { "$Aspirant.firstName$": { [Op.like]: `%${searchValue}%` } },
            { "$Aspirant.lastName$": { [Op.like]: `%${searchValue}%` } },
            {
              "$Aspirant.examinationNumber$": {
                [Op.like]: `%${searchValue}%`,
              },
            },
            { "$Subject.name$": { [Op.like]: `%${searchValue}%` } },
            { "$Term.name$": { [Op.like]: `%${searchValue}%` } },
          ],
        }
      : {};

    // Define sortable columns
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
      attributes: [
        ...columns,
        "StudentId",
        "AspirantId",
        "SubjectId",
        "TermId",
      ],
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "lastName", "registrationNumber"],
          required: false, // Student may not always be present
        },
        {
          model: Aspirant,
          attributes: ["id", "firstName", "lastName", "examinationNumber"],
          required: false, // Aspirant may not always be present
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

    // Process rows to include either Student or Aspirant
    const allRows = rows.map((row) => {
      const user = row.Student || row.Aspirant || {}; // Pick Student if available, else Aspirant
      return {
        id: row.id,
        userType: row.Student ? "Student" : "Aspirant",
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        registrationNumber:
          user.registrationNumber || user.examinationNumber || "N/A",
        subject: row.Subject.name,
        term: row.Term.name,
        correctCount: row.correctCount,
        totalQuestions: row.totalQuestions,
        scorePercentage: row.scorePercentage,
        totalAnswered: row.totalAnswered,
      };
    });

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
