'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check and fix UserNotifications table structure
    const tableDescription = await queryInterface.describeTable('UserNotifications');
    
    // Add missing columns if they don't exist
    if (!tableDescription.TeacherId) {
      await queryInterface.addColumn('UserNotifications', 'TeacherId', {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      });
      console.log('Added TeacherId column to UserNotifications');
    }
    
    if (!tableDescription.StudentId) {
      await queryInterface.addColumn('UserNotifications', 'StudentId', {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      });
      console.log('Added StudentId column to UserNotifications');
    }
    
    if (!tableDescription.AspirantId) {
      await queryInterface.addColumn('UserNotifications', 'AspirantId', {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      });
      console.log('Added AspirantId column to UserNotifications');
    }
    
    if (!tableDescription.NotificationId) {
      await queryInterface.addColumn('UserNotifications', 'NotificationId', {
        type: Sequelize.UUID,
        allowNull: false,
      });
      console.log('Added NotificationId column to UserNotifications');
    }
    
    if (!tableDescription.seen) {
      await queryInterface.addColumn('UserNotifications', 'seen', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
      console.log('Added seen column to UserNotifications');
    }
    
    // Add composite unique indexes if they don't exist
    try {
      await queryInterface.addIndex('UserNotifications', {
        fields: ['NotificationId', 'StudentId'],
        unique: true,
        name: 'un_notif_student',
      });
      console.log('Added un_notif_student index');
    } catch (e) {
      console.log('Index un_notif_student already exists or error:', e.message);
    }
    
    try {
      await queryInterface.addIndex('UserNotifications', {
        fields: ['NotificationId', 'AspirantId'],
        unique: true,
        name: 'un_notif_aspirant',
      });
      console.log('Added un_notif_aspirant index');
    } catch (e) {
      console.log('Index un_notif_aspirant already exists or error:', e.message);
    }
    
    try {
      await queryInterface.addIndex('UserNotifications', {
        fields: ['NotificationId', 'TeacherId'],
        unique: true,
        name: 'un_notif_teacher',
      });
      console.log('Added un_notif_teacher index');
    } catch (e) {
      console.log('Index un_notif_teacher already exists or error:', e.message);
    }

    // Check and add ClassId to Timetables if missing
    try {
      const timetableDesc = await queryInterface.describeTable('Timetables');
      if (!timetableDesc.ClassId) {
        await queryInterface.addColumn('Timetables', 'ClassId', {
          type: Sequelize.UUID,
          allowNull: true,
        });
        console.log('Added ClassId column to Timetables');
      }
    } catch (e) {
      console.log('Timetables check error:', e.message);
    }

    console.log('Schema fix migration completed');
  },

  async down(queryInterface, Sequelize) {
    // Remove added columns
    try {
      await queryInterface.removeColumn('UserNotifications', 'TeacherId');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('UserNotifications', 'un_notif_student');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('UserNotifications', 'un_notif_aspirant');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('UserNotifications', 'un_notif_teacher');
    } catch (e) {}
  }
};
