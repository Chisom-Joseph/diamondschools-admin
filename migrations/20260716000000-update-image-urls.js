'use strict';

const path = require('path');

function getNewUrl(oldUrl, subFolder) {
  if (!oldUrl) return null;
  // If it's already using the CDN domain, do nothing
  if (oldUrl.includes('files.diamondschools.com.ng')) {
    return oldUrl;
  }
  // Extract filename
  const filename = path.basename(oldUrl);
  return `https://files.diamondschools.com.ng/${subFolder}/${filename}`;
}

function getOldUrl(currentUrl, mainWebsiteUrl, subFolder) {
  if (!currentUrl) return null;
  // Extract filename
  const filename = path.basename(currentUrl);
  const baseUrl = mainWebsiteUrl || 'http://localhost:4728';
  return `${baseUrl}/assets/img/${subFolder}/${filename}`;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const mainWebsiteUrl = process.env.MAIN_WEBSITE_URL;

    // 1. Update Students
    try {
      const students = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl FROM Students WHERE profileImageUrl IS NOT NULL',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const student of students) {
        if (student.profileImageUrl) {
          const newUrl = getNewUrl(student.profileImageUrl, 'student_photos');
          if (newUrl !== student.profileImageUrl) {
            await queryInterface.sequelize.query(
              'UPDATE Students SET profileImageUrl = :newUrl WHERE id = :id',
              {
                replacements: { newUrl, id: student.id },
                type: queryInterface.sequelize.QueryTypes.UPDATE
              }
            );
          }
        }
      }
      console.log('Updated Students profileImageUrl paths');
    } catch (e) {
      console.log('Error updating Students:', e.message);
    }

    // 2. Update Teachers
    try {
      const teachers = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl FROM Teachers WHERE profileImageUrl IS NOT NULL',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const teacher of teachers) {
        if (teacher.profileImageUrl) {
          const newUrl = getNewUrl(teacher.profileImageUrl, 'teacher_photos');
          if (newUrl !== teacher.profileImageUrl) {
            await queryInterface.sequelize.query(
              'UPDATE Teachers SET profileImageUrl = :newUrl WHERE id = :id',
              {
                replacements: { newUrl, id: teacher.id },
                type: queryInterface.sequelize.QueryTypes.UPDATE
              }
            );
          }
        }
      }
      console.log('Updated Teachers profileImageUrl paths');
    } catch (e) {
      console.log('Error updating Teachers:', e.message);
    }

    // 3. Update Aspirants
    try {
      const aspirants = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl, paymentProofUrl FROM Aspirants',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const aspirant of aspirants) {
        if (aspirant.profileImageUrl) {
          const newUrl = getNewUrl(aspirant.profileImageUrl, 'student_photos');
          if (newUrl !== aspirant.profileImageUrl) {
            await queryInterface.sequelize.query(
              'UPDATE Aspirants SET profileImageUrl = :newUrl WHERE id = :id',
              {
                replacements: { newUrl, id: aspirant.id },
                type: queryInterface.sequelize.QueryTypes.UPDATE
              }
            );
          }
        }
        if (aspirant.paymentProofUrl) {
          const newUrl = getNewUrl(aspirant.paymentProofUrl, 'payment_proofs');
          if (newUrl !== aspirant.paymentProofUrl) {
            await queryInterface.sequelize.query(
              'UPDATE Aspirants SET paymentProofUrl = :newUrl WHERE id = :id',
              {
                replacements: { newUrl, id: aspirant.id },
                type: queryInterface.sequelize.QueryTypes.UPDATE
              }
            );
          }
        }
      }
      console.log('Updated Aspirants profileImageUrl and paymentProofUrl paths');
    } catch (e) {
      console.log('Error updating Aspirants:', e.message);
    }

    // 4. Update Admins (if table and column exist)
    try {
      const admins = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl FROM Admins WHERE profileImageUrl IS NOT NULL',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const admin of admins) {
        if (admin.profileImageUrl) {
          const newUrl = getNewUrl(admin.profileImageUrl, 'profile_photos');
          if (newUrl !== admin.profileImageUrl) {
            await queryInterface.sequelize.query(
              'UPDATE Admins SET profileImageUrl = :newUrl WHERE id = :id',
              {
                replacements: { newUrl, id: admin.id },
                type: queryInterface.sequelize.QueryTypes.UPDATE
              }
            );
          }
        }
      }
      console.log('Updated Admins profileImageUrl paths');
    } catch (e) {
      console.log('Error updating Admins:', e.message);
    }
  },

  async down(queryInterface, Sequelize) {
    const mainWebsiteUrl = process.env.MAIN_WEBSITE_URL;

    // 1. Rollback Students
    try {
      const students = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl FROM Students WHERE profileImageUrl IS NOT NULL',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const student of students) {
        if (student.profileImageUrl && student.profileImageUrl.includes('files.diamondschools.com.ng')) {
          const oldUrl = getOldUrl(student.profileImageUrl, mainWebsiteUrl, 'studentPhotos');
          await queryInterface.sequelize.query(
            'UPDATE Students SET profileImageUrl = :oldUrl WHERE id = :id',
            {
              replacements: { oldUrl, id: student.id },
              type: queryInterface.sequelize.QueryTypes.UPDATE
            }
          );
        }
      }
    } catch (e) {}

    // 2. Rollback Teachers
    try {
      const teachers = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl FROM Teachers WHERE profileImageUrl IS NOT NULL',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const teacher of teachers) {
        if (teacher.profileImageUrl && teacher.profileImageUrl.includes('files.diamondschools.com.ng')) {
          const oldUrl = getOldUrl(teacher.profileImageUrl, mainWebsiteUrl, 'teacherPhotos');
          await queryInterface.sequelize.query(
            'UPDATE Teachers SET profileImageUrl = :oldUrl WHERE id = :id',
            {
              replacements: { oldUrl, id: teacher.id },
              type: queryInterface.sequelize.QueryTypes.UPDATE
            }
          );
        }
      }
    } catch (e) {}

    // 3. Rollback Aspirants
    try {
      const aspirants = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl, paymentProofUrl FROM Aspirants',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const aspirant of aspirants) {
        if (aspirant.profileImageUrl && aspirant.profileImageUrl.includes('files.diamondschools.com.ng')) {
          const oldUrl = getOldUrl(aspirant.profileImageUrl, mainWebsiteUrl, 'studentPhotos');
          await queryInterface.sequelize.query(
            'UPDATE Aspirants SET profileImageUrl = :oldUrl WHERE id = :id',
            {
              replacements: { oldUrl, id: aspirant.id },
              type: queryInterface.sequelize.QueryTypes.UPDATE
            }
          );
        }
        if (aspirant.paymentProofUrl && aspirant.paymentProofUrl.includes('files.diamondschools.com.ng')) {
          const oldUrl = getOldUrl(aspirant.paymentProofUrl, mainWebsiteUrl, 'paymentProofs');
          await queryInterface.sequelize.query(
            'UPDATE Aspirants SET paymentProofUrl = :oldUrl WHERE id = :id',
            {
              replacements: { oldUrl, id: aspirant.id },
              type: queryInterface.sequelize.QueryTypes.UPDATE
            }
          );
        }
      }
    } catch (e) {}

    // 4. Rollback Admins
    try {
      const admins = await queryInterface.sequelize.query(
        'SELECT id, profileImageUrl FROM Admins WHERE profileImageUrl IS NOT NULL',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      for (const admin of admins) {
        if (admin.profileImageUrl && admin.profileImageUrl.includes('files.diamondschools.com.ng')) {
          const oldUrl = getOldUrl(admin.profileImageUrl, mainWebsiteUrl, 'profilePhotos');
          await queryInterface.sequelize.query(
            'UPDATE Admins SET profileImageUrl = :oldUrl WHERE id = :id',
            {
              replacements: { oldUrl, id: admin.id },
              type: queryInterface.sequelize.QueryTypes.UPDATE
            }
          );
        }
      }
    } catch (e) {}
  }
};
