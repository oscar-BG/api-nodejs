const jwt = require('jwt-simple');
const moment = require('moment');

// Clave secreta para codificar el token
const secret = "90DSMK*d+#SASA_sa434";

const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        imagen : user.img,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    secret
}