module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define("UserNotification", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StudentId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      // FK defined by association in models/index.js
    },
    AspirantId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      // FK defined by association in models/index.js
    },
    TeacherId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      // FK defined by association in models/index.js
    },
    NotificationId: {
      type: DataTypes.UUID,
      allowNull: false,
      // FK defined by association in models/index.js
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    indexes: [
      { unique: true, fields: ['NotificationId', 'StudentId'], name: 'un_notif_student' },
      { unique: true, fields: ['NotificationId', 'AspirantId'], name: 'un_notif_aspirant' },
      { unique: true, fields: ['NotificationId', 'TeacherId'], name: 'un_notif_teacher' },
    ],
  });

  return UserNotification;
};
