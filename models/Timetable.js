module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define(
    "Timetable",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // ClassId is defined by the association in models/index.js
      // Do NOT define it here to avoid duplicate FK constraint errors
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["day", "time"],
        }
      ]
    }
  );
  return Timetable;
};