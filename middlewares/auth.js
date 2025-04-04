const jwt = require('jwt-simple');
const moment = require('moment');
const jwtS = require('../services/jwt');
const secret = jwtS.secret;

exports.auth = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(403).json({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        });    
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        let payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: "error",
                message: "El token ha expirado"
            });
        }

        req.user = payload;

    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: "Token no valido"
        });
    }

    
    next();

}