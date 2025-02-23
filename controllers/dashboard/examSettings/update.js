const examSettingsSchema = require("../../../validation/examSettings/update");
const { ExamSettings } = require("../../../models");

module.exports = async (req, res) => {
  const {
    duration,
    questionLimit,
    shuffleQuestions,
    shuffleOptions,
    markPerQuestion,
    startDate,
    endDate,
    startTime,
  } = req.body;
  try {
    // Validate exam
    const examValid = examSettingsSchema.validate(req.body);
    if (examValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: examValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/exam-settings");
    }

    await ExamSettings.upsert({
      duration,
      questionLimit,
      shuffleQuestions: shuffleQuestions === "yes" ? true : false,
      shuffleOptions: shuffleOptions === "yes" ? true : false,
      markPerQuestion,
      startDate,
      endDate,
      startTime,
      uniqueKey: 1,
    }); // Always use 1

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Exam added successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "add");
    req.flash("status", 200);
    return res.redirect("/dashboard/exam-settings");
  } catch (error) {
    console.log(error);
  }
};
