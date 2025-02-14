module.exports = async (req, res) => {
  try {
    const formatDateForInput = require("../../utils/formatDateForInput");
    const academicYear = await require("../../utils/getAcademicYearById")(
      req.params.id
    );

    academicYear.startDate = formatDateForInput(academicYear.startDate);
    academicYear.endDate = formatDateForInput(academicYear.endDate);

    console.log(academicYear);

    res.json(academicYear);
  } catch (error) {
    console.error("ERROR GETTING SUBJECT AND CLASSES");
    console.error(error);
  }
};
