const { ExamSettings } = require("../models");

module.exports = async () => {
  try {
    const examSettings = await ExamSettings.findOne({
      where: { uniqueKey: 1 },
    });

    if (!examSettings) return {};

    return {
      ...examSettings.toJSON(),
      shuffleQuestions: examSettings.shuffleQuestions ? "yes" : "no",
      shuffleOptions: examSettings.shuffleOptions ? "yes" : "no",
    };
  } catch (error) {
    console.error("ERROR GETTING EXAM SETTINGS");
    console.error(error);
    return {};
  }
};
