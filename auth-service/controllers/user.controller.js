exports.allAccess = (req, res) => {
    res.status(200).send('Public Content.');
};
  
exports.userBoard = (req, res) => {
    res.status(200).send('User Content.');
};
  
exports.patientBoard = (req, res) => {
    res.status(200).send('Patient Content.');
};
  
exports.dentalOfficeAdminBoard = (req, res) => {
    res.status(200).send('Dental Office Content.');
};

exports.dentistBoard = (req, res) => {
    res.status(200).send('Dental Office Content.');
};