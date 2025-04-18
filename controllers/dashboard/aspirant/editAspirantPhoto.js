const axios = require("axios");
const multer = require("multer");
const sutdentProfileImageUpload = require("../../../middlewares/aspirantProfileImageUpload");
const { Aspirant } = require("../../../models");

module.exports = async (req, res) => {
  try {
    sutdentProfileImageUpload(req, res, async (err) => {
      // Handle profile image errors
      if (err instanceof multer.MulterError) {
        if ((err.code = "LIMIT_FILE_SIZE")) {
          req.flash("alert", {
            status: "error",
            message: "File size too large. Maximum file size is 2MB",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect(req.baseUrl + req.path);
        } else if (err) {
          req.flash("alert", {
            status: "error",
            message: "Failed to upload file",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect(req.baseUrl + req.path);
        }
      }

      // Check if photo was uploaded
      if (!req.file) {
        req.flash("alert", {
          status: "error",
          message: "Profile photo is required",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect(req.baseUrl + req.path);
      }

      const aspirantId = req.params.id || req.body.aspirantId;

      //   Get current profile image
      const aspirant = await Aspirant.findByPk(aspirantId);

      if (!aspirant) {
        req.flash("alert", {
          status: "error",
          section: "block",
          message: "Aspirant not found",
        });
        req.flash("status", 404);
        return res.redirect(req.baseUrl + req.path);
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      const FormData = require("form-data");
      const formData = new FormData();
      formData.append("file", fileBuffer, fileName);
      formData.append("previousProfilePhoto", aspirant.profileImageUrl);

      // Upload image
      let profileImageUrl;
      try {
        const response = await axios.post(
          `${process.env.MAIN_WEBSITE_URL}/api/addstudentPhoto`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `bearer ${process.env.MAIN_WEBSITE_ACCESS_TOKEN}`,
            },
          }
        );
        profileImageUrl = response.data.file.profileImageUrl;
        console.log(response.data);

        // Update aspirant
        const editedAspirant = await Aspirant.update(
          {
            profileImageUrl,
          },
          { where: { id: aspirantId } }
        );
        console.log(editedAspirant);

        // Send alert
        req.flash("alert", {
          status: "success",
          section: "add",
          message: `Aspirant ${
            req.body.aspirantId ? aspirant.examinationNumber : ""
          } updated successfully`,
        });
        req.flash("form", "");
        req.flash("status", 200);
        return res.redirect(req.baseUrl + req.path);
      } catch (error) {
        // Handle Axios errors
        req.flash("alert", {
          status: "error",
          message: "Error uploading profile image",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect(req.baseUrl + req.path);
      }
    });
  } catch (error) {
    console.error(error);
    console.error("ERROR ADDING ASPIRANT");
    req.flash("alert", {
      status: "error",
      section: "add",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect(req.baseUrl + req.path);
  }
};
