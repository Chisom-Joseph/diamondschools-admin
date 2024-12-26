const dbConfig = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");

const Admin = require("./Admin");
const Student = require("./Student");
const Class = require("./Class");
const Guardian = require("./Guardian");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  polli: {
    min: dbConfig.poll.min,
    max: dbConfig.poll.max,
    aquire: dbConfig.poll.acquire,
    idle: dbConfig.poll.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// DBs
db.Student = Student(sequelize, DataTypes);
db.Class = Class(sequelize, DataTypes);
db.Guardian = Guardian(sequelize, DataTypes);
db.Admin = Admin(sequelize, DataTypes);

// Relations
db.Student.belongsTo(db.Class);
db.Class.hasMany(db.Student);

db.Student.belongsTo(db.Guardian);
db.Guardian.hasMany(db.Student);

module.exports = db;
