const bcrypt = require("bcryptjs");
const signUpScema = require("../../validation/admin/signUp");
const { Admin } = require("../../models");

module.exports = async (req, res) => {
  try {
    // Validate the admin
    const adminValid = signUpScema.validate(req.body);
    if (adminValid.error) {
      req.flash("alert", {
        status: "error",
        message: adminValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-up");
    }

    // Check if email already is in use
    const emailExsits = await Admin.findOne({
      where: { email: req.body.email },
    });
    if (emailExsits) {
      req.flash("alert", {
        status: "error",
        message: "Email already in use",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-up");
    }

    // Check if username already exists
    const usernameExsits = await Admin.findOne({
      where: { username: req.body.username },
    });
    if (usernameExsits) {
      req.flash("alert", {
        status: "error",
        message: "Username already in use",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-up");
    }

    // Compare passwords
    const passwordsMatch = req.body.password === req.body.passwordConfirm;
    if (!passwordsMatch) {
      req.flash("alert", {
        status: "error",
        message: "Passwords do not match",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-up");
    }

    // Generate password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create admin
    const newAdmin = await Admin.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(newAdmin);

    req.flash("alert", {
      status: "success",
      message: "Account created successfully! Login to continue",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    return res.redirect("/auth/sign-in");
  } catch (error) {
    console.error(`ERROR CREATING ADNIN ACCOUNT: ${error}`);
    req.flash("alert", {
      status: "error",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect("/auth/sign-up");
  }
};
