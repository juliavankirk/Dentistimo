module.exports = (sequelize, Sequelize) => {
    const DentalOffice = sequelize.define("dental-office", {
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        availability: {
            type: Sequelize.ARRAY(DataTypes.DATE)
        }
    });

    return Patient;
}