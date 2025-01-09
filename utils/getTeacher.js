const { Teacher } = require("../models");

module.exports = async (id) => {
  try {
    const teacherFromDb = await Teacher.findOne({ where: { id } });
    if (!teacherFromDb) return {};

    const teacher = teacherFromDb.dataValues;

    teacher.guardian = await require("../utils/getGuardian")(
      teacher.GuardianId
    );

    // Defualt profile image
    teacher.defaultProfileImageUrl = `${process.env.MAIN_WEBSITE_URL}/assets/img/teacherPhotos/default.png`;

    console.log(teacher);
    if (teacher) return teacher;
    return {};
  } catch (error) {
    console.log("ERROR GETTING ASPIRANT");
    console.log(error);
    return {};
  }
};
