const signUpScema = require("../../validation/signUp");

module.exports = async (req, res) => {
  try {
    // Validate the student
    const studentValid = signUpScema.validate(req.body);
    if (studentValid.error)
      return res.render("auth/signUp.ejs", {
        error: { message: studentValid.error.message },
        form: req.body,
      });

    // Check if student already exists
    // Create student

    res.json(req.body);
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
};
