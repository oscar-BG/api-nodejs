const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwtS = require('../services/jwt');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

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
        attributes: ['id', 'name', 'surname', 'nick', 'email', 'role', 'image', 'password'],
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
            image: user.image
        },
        token
    });
}

const profile = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
        
    }

    try {
        
        let userJson = await User.findByPk(id, {
            attributes: ['id', 'name', 'surname', 'nick', 'email', 'image', 'createdAt'],
        });
    
        if (!userJson) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
    
        return res.status(200).json({
            status: "success",
            message: "Usuario encontrado",
            user: userJson
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        })   
    }

}

const list = async (req, res) => {
    let page = req.params.page ? parseInt(req.params.page) : 1;
    let itemsPerPage = 5;

    let offset = (page - 1) * itemsPerPage;
    console.log(offset);
    let total = await User.count();

    let totalPages = Math.ceil(total / itemsPerPage);
    if (page > totalPages || page <= 0) {
        return res.status(404).json({
            status: "error",
            message: "No hay usuarios para mostrar"
        });
    }
    let users = await User.findAll({
        attributes: ['id', 'name', 'surname', 'nick', 'email', 'role', 'image'],
        limit: itemsPerPage,
        offset: offset,
        order: [
            ['id', 'ASC']
        ]
    });

    return res.status(200).json({
        status: "success",
        message: "Listado de usuarios",
        users: users,
        page: page,
        total: total,
        totalPages: totalPages,
        itemsPerPage: itemsPerPage
    });
}

const update = async (req, res) => {

    let user_identity = req.user;
    let user_to_update = req.body;
    delete user_identity.iat;
    delete user_identity.exp;
    delete user_identity.role;
    delete user_identity.image;

    try {
        
        let find_users = await User.findAll({
            attributes: ['id', 'email', 'nick'],
            where : {
                [Op.or] : [{email: req.body.email}, {nick: req.body.nick}]
            }
        });

        let user_isset = false;
        find_users.forEach(user => {
            if (user.dataValues.id != user_identity.id) {
                user_isset = true;
            }
        });
    
        if (user_isset) {
            return res.status(400).json({
                status: "error",
                message: "El email o el nick ya existe"
            })
        }

        if (user_to_update.password) {
            let pwd = await bcrypt.hash(user_to_update.password, 10);
            user_to_update.password = pwd;
        }

        await User.update(user_to_update, {
            where: {
                id: user_identity.id
            }
        });

        let user_update = await User.findByPk(user_identity.id, {
            attributes: ['id', 'name', 'surname', 'nick', 'email', 'role', 'image'],
        });
        
    
        return res.status(200).json({
            status: "success",
            message: "Actualizar usuario",
            user: user_update
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        });
    }

}

const upload = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            status: "error",
            message: "No se ha subido la imagen"
        });
    }

    try {
        let image = req.file.originalname;
        let extencion = path.extname(image).toLowerCase();
        let valid_ext = ['.png', '.jpg', '.jpeg'];
        if (!valid_ext.includes(extencion)) {
    
            const file_path = req.file.path;
            fs.unlinkSync(file_path)
    
            return res.status(400).json({
                status: "error",
                message: "La extension no es valida",
            });
        }
    
        await User.update({
            image: req.file.filename
        }, {
            where: {
                id: req.user.id
            }
        });
    
        let user_update = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'surname', 'nick', 'email', 'role', 'image'],
        });
    
        return res.status(200).json({
            status: "success",
            message: "Imagen subida",
            user: user_update,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        });
    }

}

const avatar = (req, res) => {

    const file = req.params.file;

    const file_path = './uploads/avatars/' + file;
    fs.stat(file_path, (err, exists) => {
        if (err || !exists) {
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe"
            });
        }

        return res.sendFile(path.resolve(file_path));

    });
}


module.exports = {
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
};