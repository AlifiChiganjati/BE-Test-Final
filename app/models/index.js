const config = require("../config/db");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Survey = require("./Survey")(sequelize, Sequelize);
db.Attack = require("./Attack")(sequelize, Sequelize);

// Mendefinisikan relasi
db.User.hasMany(db.Survey, {
  foreignKey: "userId",
  as: "surveys",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.Survey.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});
module.exports = db;
