const { Teacher } = require("../models");

module.exports = async () => {
  try {
    const teachersFromDb = await Teacher.findAll();

    const teachers = Promise.all(
      teachersFromDb.map(async (teacher) => {
        const currentTeacher = teacher.dataValues;

        // Defualt profile image
        currentTeacher.defaultProfileImageUrl = `${process.env.MAIN_WEBSITE_URL}/assets/img/teacherPhotos/default.png`;

        return currentTeacher;
      })
    );

    console.log(await teachers);
    return teachers;
  } catch (error) {
    console.log(`ERROR GETTING STUDENTS: ${error}`);
    return [];
  }
};
