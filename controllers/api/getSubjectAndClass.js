module.exports = async (req, res) => {
  try {
    const subject = await require("../../utils/getSubject")(req.params.id);

    const classes = await require("../../utils/getClasses")();

    res.json({ classes, subject });
  } catch (error) {
    console.error("ERROR GETTING SUBJECT AND CLASSES");
    console.error(error);
  }
};
