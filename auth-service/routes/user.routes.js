const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.get('/api/test/all', controller.allAccess);

    app.get(
        '/api/test/patient',
        [authJwt.verifyToken, authJwt.isPatient],
        controller.patientBoard
    );

    app.get(
        '/api/test/dental-office-admin',
        [authJwt.verifyToken, authJwt.isDentalOfficeAdmin],
        controller.dentalOfficeAdminBoard
    );

    app.get(
        '/api/test/dentist',
        [authJwt.verifyToken, authJwt.isDentist],
        controller.dentistBoard
    );
};