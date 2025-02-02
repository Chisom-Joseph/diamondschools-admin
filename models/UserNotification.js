module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define("UserNotification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    StudentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Students", key: "id" },
      unique: false,
    },
    AspirantId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Aspirants", key: "id" },
      unique: false,
    },
    NotificationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Notifications", key: "id" },
      unique: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return UserNotification;
};
