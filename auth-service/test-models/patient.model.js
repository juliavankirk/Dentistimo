module.exports = (sequelize, Sequelize) => {
    const Patient = sequelize.define("patients", {
        name: {
            type: Sequelize.STRING
        },
        birthday: {
            type: Sequelize.DATEONLY
        },
        address: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });

    return Patient;
}