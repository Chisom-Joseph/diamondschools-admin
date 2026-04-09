'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if id column exists in UserNotifications
    const tableDesc = await queryInterface.describeTable('UserNotifications');
    
    if (!tableDesc.id) {
      // First, drop the existing composite primary key
      try {
        await queryInterface.sequelize.query(
          'ALTER TABLE `UserNotifications` DROP PRIMARY KEY'
        );
        console.log('Dropped existing composite primary key');
      } catch (e) {
        console.log('Could not drop primary key:', e.message);
      }
      
      // Add id column as primary key
      await queryInterface.addColumn('UserNotifications', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        first: true,
      });
      console.log('Added id primary key column to UserNotifications');
    }
    
    console.log('UserNotifications table fix completed');
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('UserNotifications', 'id');
    } catch (e) {}
  }
};
