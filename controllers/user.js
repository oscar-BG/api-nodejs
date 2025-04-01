const User = require('../models/user');

// Registros de usuarios
const register = async (req, res) => {
    let params = req.body;

    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })

    }

    // Crear objeto de usuario
    let user_to_save = await User.create({
        name: params.name,
        nick: params.nick,
        email: params.email
    });
    
    console.log(user_to_save.toJSON());

    

    return res.status(200).json({
        status: "success",
        message: "Registro de usuario exitoso",
        params
    })
}

module.exports = {
    register
};