module.exports = (sequelize, Sequelize) => {
    const PatientDetails = sequelize.define("patient_details", {
        birthday: {
            type: Sequelize.DATEONLY
        },
        address: {
            type: Sequelize.STRING
        }
    });

    return PatientDetails;
}
