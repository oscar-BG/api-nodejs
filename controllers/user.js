const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwtS = require('../services/jwt');
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

    try {
        // Validar si el email ya existe
        let find_uers = await User.findAll({
            attributes: ['email'],
            where : {
                [Op.or] : [{email: params.email}, {nick: params.nick}]
            }
        });
    
    
        if (find_uers.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "El email o el nick ya existe"
            })
            
        }

        // Encriptar contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;
    
        // Crear objeto de usuario
        let user_to_save = await User.create({
            name: params.name,
            nick: params.nick,
            email: params.email,
            password: params.password
        });
        
    
        return res.status(200).json({
            status: "success",
            message: "Registro de usuario exitoso",
            params
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        })
    }
}

const login = async (req, res) => {
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    // Buscar usuario por email
    let user = await User.findOne({
        attributes: ['id', 'name', 'surname', 'nick', 'email', 'role', 'img', 'password'],
        where: {
            email: params.email
        }
    })

    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "El usuario no existe"
        })
    }

    // Comparar contraseña
    let pwd = await bcrypt.compare(params.password, user.password);
    if (!pwd) {
        return res.status(400).json({
            status: "error",
            message: "La contraseña es incorrecta"
        })
    }

    user.password = undefined;

    // Generar token
    let token = jwtS.createToken(user);

    return res.status(200).json({
        status: "success",
        message: "Login correcto",
        user : {
            id: user.id,
            name: user.name,
            surname: user.surname,
            nick: user.nick,
            email: user.email,
            role: user.role,
            img: user.img
        },
        token
    });
}

module.exports = {
    register,
    login
};