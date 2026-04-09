module.exports = (sequelize, DataTypes) => {
  const AcademicYear = sequelize.define("AcademicYear", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      // Remove any "unique: true" here
    },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
  }, {
    indexes: [
      {
        unique: true,
        name: 'unique_academicyear_year',
        fields: ['year']
      }
    ]
  });
  return AcademicYear;
};