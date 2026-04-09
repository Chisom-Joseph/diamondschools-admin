'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, drop all existing foreign key constraints to prevent duplicates
    const tables = [
      'Timetables', 'Terms', 'Students', 'Aspirants', 'ClassSubjects',
      'UserNotifications', 'Results', 'ClassStats', 'StudentTermPerformances',
      'FeatureAccesses', 'AttemptedSubjects', 'Questions', 'Options', 'OptionNames'
    ];

    for (const table of tables) {
      try {
        const [constraints] = await queryInterface.sequelize.query(
          `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
          { replacements: [table] }
        );

        for (const { CONSTRAINT_NAME } of constraints) {
          try {
            await queryInterface.sequelize.query(
              `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${CONSTRAINT_NAME}\``
            );
            console.log(`Dropped FK constraint: ${CONSTRAINT_NAME} from ${table}`);
          } catch (e) {
            // Ignore if constraint doesn't exist
          }
        }
      } catch (e) {
        // Table might not exist
      }
    }

    // Fix UserNotifications table - check for multiple primary keys
    try {
      const [pkCols] = await queryInterface.sequelize.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'UserNotifications' AND COLUMN_KEY = 'PRI`
      );
      
      // If there are multiple PK columns or the structure is wrong, recreate the table
      if (pkCols.length > 1 || (pkCols.length === 1 && pkCols[0].COLUMN_NAME !== 'id')) {
        // Backup and recreate
        await queryInterface.sequelize.query(
          `CREATE TABLE IF NOT EXISTS UserNotifications_backup AS SELECT * FROM UserNotifications`
        );
        await queryInterface.dropTable('UserNotifications');
        await queryInterface.createTable('UserNotifications', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          StudentId: {
            type: Sequelize.UUID,
            allowNull: true,
            defaultValue: null,
          },
          AspirantId: {
            type: Sequelize.UUID,
            allowNull: true,
            defaultValue: null,
          },
          TeacherId: {
            type: Sequelize.UUID,
            allowNull: true,
            defaultValue: null,
          },
          NotificationId: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          seen: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        });
        
        // Add indexes
        await queryInterface.addIndex('UserNotifications', {
          fields: ['NotificationId', 'StudentId'],
          unique: true,
          name: 'un_notif_student',
        });
        await queryInterface.addIndex('UserNotifications', {
          fields: ['NotificationId', 'AspirantId'],
          unique: true,
          name: 'un_notif_aspirant',
        });
        await queryInterface.addIndex('UserNotifications', {
          fields: ['NotificationId', 'TeacherId'],
          unique: true,
          name: 'un_notif_teacher',
        });
        
        console.log('Recreated UserNotifications table with correct schema');
      }
    } catch (e) {
      console.log('UserNotifications table check:', e.message);
    }

    console.log('FK constraint cleanup migration completed');
  },

  async down(queryInterface, Sequelize) {
    // This migration is a one-way fix, no down migration needed
  }
};
