const axios = require("axios");
const { Aspirant } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const aspirantId = req.params.id || req.body.aspirantId;
    const aspirant = await Aspirant.findOne({ where: { id: aspirantId } });

    if (!aspirant) {
      req.flash("alert", {
        status: "error",
        section: "block",
        message: "Aspirant not found",
      });
      req.flash("status", 404);
      return res.redirect(req.baseUrl + req.path);
    }

    // Delete aspirant provile image
    const FormData = require("form-data");
    const formData = new FormData();
    formData.append("profilePhoto", aspirant.dataValues.profileImageUrl);

    const response = await axios.post(
      `${process.env.MAIN_WEBSITE_URL}/api/deleteStudentPhoto`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `bearer ${process.env.MAIN_WEBSITE_ACCESS_TOKEN}`,
        },
      }
    );
    console.log(response.data);

    // Delete aspirant
    await Aspirant.destroy({ where: { id: aspirantId } });

    req.flash("alert", {
      status: "success",
      section: "add",
      message: `Aspirant ${aspirant.examinationNumber} deleted successfully`,
    });
    req.flash("form", "");
    req.flash("status", 200);
    res.redirect("/dashboard/all-aspirants");
  } catch (error) {
    console.error(error);
    console.error("ERROR BLOCKING ASPIRANT");
    req.flash("alert", {
      status: "error",
      section: "block",
      message: "Something went wrong",
    });
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
