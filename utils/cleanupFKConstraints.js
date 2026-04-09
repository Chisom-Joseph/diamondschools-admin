/**
 * Pre-sync Foreign Key Constraint Cleanup
 * 
 * This script removes duplicate and conflicting foreign key constraints from the database
 * before Sequelize sync attempts to add new ones.
 * 
 * This solves the ER_FK_DUP_NAME error that occurs when:
 * 1. A model defines a foreign key field
 * 2. An association also references the same field
 * 3. Sequelize tries to add a constraint for both
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Tables that have had FK issues - drop all their FK constraints before sync
const PROBLEMATIC_TABLES = [
  'Timetables',
  'Terms', 
  'Students',
  'Aspirants',
  'ClassSubjects',
  'UserNotifications',
  'Results',
  'ClassStats',
  'StudentTermPerformances',
  'FeatureAccesses',
  'AttemptedSubjects',
  'Questions',
  'Options',
  'OptionNames'
];

async function cleanupDuplicateFKConstraints() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.DB_PORT || 3306,
  });

  console.log('🔍 Checking for foreign key constraints to clean up...');

  try {
    // First, drop all FK constraints from problematic tables
    for (const tableName of PROBLEMATIC_TABLES) {
      try {
        const [constraints] = await connection.query(`
          SELECT CONSTRAINT_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = ?
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `, [process.env.DB, tableName]);

        if (constraints.length > 0) {
          console.log(`\n📦 Table: ${tableName}`);
          for (const { CONSTRAINT_NAME } of constraints) {
            try {
              await connection.query(`
                ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${CONSTRAINT_NAME}\`
              `);
              console.log(`  🗑️ Dropped: ${CONSTRAINT_NAME}`);
            } catch (err) {
              if (err.code !== 'ER_NONEXISTING_TABLE') {
                console.error(`  ⚠️ Could not drop ${CONSTRAINT_NAME}: ${err.message}`);
              }
            }
          }
        }
      } catch (err) {
        // Table might not exist yet
        if (err.code !== 'ER_NONEXISTING_TABLE') {
          console.error(`⚠️ Error checking table ${tableName}: ${err.message}`);
        }
      }
    }

    // Then check for any remaining duplicates across all tables
    const [allConstraints] = await connection.query(`
      SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE 
        TABLE_SCHEMA = ? 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY 
        TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
    `, [process.env.DB]);

    // Group constraints by table and column to find duplicates
    const groupedConstraints = {};
    for (const constraint of allConstraints) {
      const key = `${constraint.TABLE_NAME}.${constraint.COLUMN_NAME}`;
      if (!groupedConstraints[key]) {
        groupedConstraints[key] = [];
      }
      groupedConstraints[key].push(constraint);
    }

    // Find and remove duplicates
    const duplicates = Object.entries(groupedConstraints).filter(([key, cons]) => cons.length > 1);

    if (duplicates.length > 0) {
      console.log(`\n⚠️ Found ${duplicates.length} duplicate constraint(s):`);

      for (const [key, cons] of duplicates) {
        console.log(`\n  Table: ${cons[0].TABLE_NAME}, Column: ${cons[0].COLUMN_NAME}`);
        console.log(`  Referenced: ${cons[0].REFERENCED_TABLE_NAME}.${cons[0].REFERENCED_COLUMN_NAME}`);
        console.log(`  Constraints: ${cons.map(c => c.CONSTRAINT_NAME).join(', ')}`);

        // Keep the first constraint (usually the one we want), drop the rest
        for (let i = 1; i < cons.length; i++) {
          const constraintName = cons[i].CONSTRAINT_NAME;
          const tableName = cons[i].TABLE_NAME;
          
          console.log(`  🗑️ Dropping constraint: ${constraintName}`);
          
          try {
            await connection.query(`
              ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${constraintName}\`
            `);
            console.log(`  ✅ Dropped: ${constraintName}`);
          } catch (err) {
            console.error(`  ❌ Failed to drop ${constraintName}: ${err.message}`);
          }
        }
      }
    }

    console.log('\n✅ FK Cleanup completed!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  cleanupDuplicateFKConstraints()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Failed:', err);
      process.exit(1);
    });
}

module.exports = cleanupDuplicateFKConstraints;
