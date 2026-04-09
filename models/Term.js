module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define("Term", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Explicitly define the foreign key field
    AcademicYearId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "AcademicYears",
        key: "id"
      }
    }
  });
  return Term;
};