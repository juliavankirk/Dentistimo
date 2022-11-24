module.exports = (sequelize, Sequelize) => {
    const Patient_details = sequelize.define("patient_details", {
        birthday: {
            type: Sequelize.DATEONLY
        },
        address: {
            type: Sequelize.STRING
        }
    });

    return Patient_details;
}