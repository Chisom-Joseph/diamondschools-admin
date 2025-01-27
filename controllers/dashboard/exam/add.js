const addExamSchema = require("../../../validation/exam/add");
const { Question, Option } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const {
      option1,
      option2,
      option3,
      option4,
      question,
      correctOption,
      subject,
    } = req.body;

    // Validate exam
    const examValid = addExamSchema.validate(req.body);
    if (examValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: examValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/exam");
    }

    // Create question
    const newQuestion = await Question.create({
      name: question,
      SubjectId: subject,
    });

    // Add Questions
    const optionCorrect = (option) => {
      return correctOption === option;
    };
    [
      {
        option: option1,
        correct: optionCorrect("option1"),
      },
      {
        option: option2,
        correct: optionCorrect("option2"),
      },
      {
        option: option3,
        correct: optionCorrect("option3"),
      },
      {
        option: option4,
        correct: optionCorrect("option4"),
      },
    ].forEach(async ({ option: name, correct }) => {
      const newOption = await Option.create({
        name,
        correct,
        QuestionId: newQuestion.id,
      });
      console.log(newOption);
    });

    console.log(newQuestion);

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Exam added successfully.",
    });
    req.flash("form", "");
    req.flash("formSection", "add");
    req.flash("status", 200);
    return res.redirect("/dashboard/exam");
  } catch (error) {
    console.log(error);
  }
};
