const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(  
    config.DB,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      dialect: config.dialect,
      operatorsAliases: false,
  
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
      }
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.patient_details = require("../models/patient_details.model.js")

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsTo(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.patient_details = belongsTo(db.user, {
  through: "patient_details",
  foreignKey: "userId",
  otherKey: "Patient_DetailsId"
})

db.ROLES = ["user", "patient", "dental-office-admin", "dentist"];

module.exports = db;