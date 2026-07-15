'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addIndex('StudentTermPerformances', {
        fields: ['StudentId', 'TermId'],
        name: 'stp_student_term',
      });
      console.log('Added stp_student_term index');
    } catch (e) {
      console.log('Error adding stp_student_term:', e.message);
    }

    try {
      await queryInterface.addIndex('StudentTermPerformances', {
        fields: ['TermId', 'ClassId'],
        name: 'stp_term_class',
      });
      console.log('Added stp_term_class index');
    } catch (e) {
      console.log('Error adding stp_term_class:', e.message);
    }

    try {
      await queryInterface.addIndex('Results', {
        fields: ['StudentTermPerformanceId', 'SubjectId'],
        name: 'results_stp_subject',
      });
      console.log('Added results_stp_subject index');
    } catch (e) {
      console.log('Error adding results_stp_subject:', e.message);
    }

    try {
      await queryInterface.addIndex('ClassStats', {
        fields: ['ClassId', 'SubjectId', 'TermId'],
        unique: true,
        name: 'class_stats_unique',
      });
      console.log('Added class_stats_unique index');
    } catch (e) {
      console.log('Error adding class_stats_unique:', e.message);
    }

    try {
      await queryInterface.addIndex('Students', {
        fields: ['registrationNumber'],
        name: 'students_reg_num',
      });
      console.log('Added students_reg_num index');
    } catch (e) {
      console.log('Error adding students_reg_num:', e.message);
    }

    try {
      await queryInterface.addIndex('Aspirants', {
        fields: ['examinationNumber'],
        name: 'aspirants_exam_num',
      });
      console.log('Added aspirants_exam_num index');
    } catch (e) {
      console.log('Error adding aspirants_exam_num:', e.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex('StudentTermPerformances', 'stp_student_term');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('StudentTermPerformances', 'stp_term_class');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('Results', 'results_stp_subject');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('ClassStats', 'class_stats_unique');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('Students', 'students_reg_num');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('Aspirants', 'aspirants_exam_num');
    } catch (e) {}
  }
};
