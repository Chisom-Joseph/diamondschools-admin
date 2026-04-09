module.exports = (sequelize, DataTypes) => {
  const Guardian = sequelize.define("Guardian", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
      // ← Remove "unique: true" from here
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    relationshipToStudent: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,        // Changed from STRING to BOOLEAN (recommended)
      allowNull: false,
      defaultValue: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        name: 'unique_guardian_email',
        fields: ['email']
      }
    ]
  });
  return Guardian;
};