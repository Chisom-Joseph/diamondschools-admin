const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signInScema = require("../../validation/admin/signIn");
const { Admin } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    // Validate the admin
    const adminValid = signInScema.validate(req.body);
    if (adminValid.error) {
      req.flash("alert", {
        status: "error",
        message: adminValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    // Check if user exsists
    const adminExsits = await Admin.findOne({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.username },
        ],
      },
    });
    if (!adminExsits) {
      req.flash("alert", {
        status: "error",
        message: "Username, Email, or Password incorrect",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    const admin = adminExsits.dataValues;

    // Check if Password is correct
    const passwordsCorrect = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!passwordsCorrect) {
      req.flash("alert", {
        status: "error",
        message: "Username, Email, or Password incorrect",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    // Set expiry date for cookie and token
    let expiresIn = "2h";
    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (req.body.rememberMe && req.body.rememberMe === "on") {
      expiresIn = "3d";
      expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

    // Generate login token
    const token = jwt.sign({ id: admin.id }, process.env.A_TOKEN_SECRET, {
      expiresIn,
    });
    res.cookie("aToken", token, { expires, path: "/" });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(`ERROR CREATING ADNIN ACCOUNT: ${error}`);
    req.flash("alert", {
      status: "error",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect("/auth/sign-in");
  }
};
