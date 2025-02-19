module.exports = async (req, res) => {
  try {
    const formatDateForInput = require("../../utils/formatDateForInput");
    const term = await require("../../utils/getTerm")(req.params.id);

    term.dataValues.startDate = formatDateForInput(term.startDate);
    term.dataValues.endDate = formatDateForInput(term.endDate);

    console.log(term);

    res.json(term);
  } catch (error) {
    console.error("ERROR GETTING TERMS");
    console.error(error);
  }
};
