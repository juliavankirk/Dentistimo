/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
  
    if (!token) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.userId = decoded.id;
        next();
    });
};
  
isPatient = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'patient') {
                    next();
                    return;
                }
            }
  
            res.status(403).send({
                message: 'Require Patient Role!'
            });
            return;
        });
    });
};
  
isDentalOfficeAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'dental-office') {
                    next();
                    return;
                }
            }
  
            res.status(403).send({
                message: 'Require Dental Office Role!'
            });
        });
    });
};

isDentist = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'dentist') {
                    next();
                    return;
                }
            }
  
            res.status(403).send({
                message: 'Require Dentist Role!'
            });
        });
    });
};
   
const authJwt = {
    verifyToken: verifyToken,
    isPatient: isPatient,
    isDentalOfficeAdmin: isDentalOfficeAdmin,
    isDentist: isDentist
};
module.exports = authJwt;