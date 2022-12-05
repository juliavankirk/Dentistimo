/* eslint-disable linebreak-style */
module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define('user_role', {
        selfGranted: Sequelize.BOOLEAN
    }, { timestamps: false });
    return UserRole;
};