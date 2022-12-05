const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.PORT,
        dialect: config.dialect,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        },
        logging: console.log
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.user_roles = require('./user-roles.model')(sequelize, Sequelize);
db.patient_details = require('./patient_details.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId'
});
db.user.belongsToMany(db.role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});

db.patient_details.belongsTo(db.user,{foreignKey: 'userId', otherKey: 'patId' });
db.user.hasOne(db.patient_details,{foreignKey: 'userId', otherKey: 'patId' });

db.ROLES = ['patient', 'dental-office-admin', 'dentist'];

module.exports = db;
