module.exports = (sequelize, Sequelize) => {
    const PatientDetails = sequelize.define('patient_details', {
        personalNumber: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.STRING
        }
    });

    return PatientDetails;
};
