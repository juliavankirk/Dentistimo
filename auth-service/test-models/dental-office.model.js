module.exports = (sequelize, Sequelize) => {
    const DentalOffice = sequelize.define("dental-office", {
        name: {
            type: Sequelize.STRING
        },
        owner: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        city: {
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