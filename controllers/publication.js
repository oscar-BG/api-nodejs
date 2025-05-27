const Publication = require('../models/publication');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const FollowService = require('../services/followService');
const { count } = require('console');

const save = async (req, res) => {
    let params = req.body;

    if (!params.text) {
        return res.status(400).json({
            status: 'error',
            message: 'No se ha enviado el texto de la publicación'
        });
    }

    try {
        let newPublication = await Publication.create({text: params.text, user_id: req.user.id})
        return res.status(200).json({
            status: 'success',
            publication: newPublication,
            message: 'save publication'
        });
        
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al guardar la publicación',
            error: error
        });        
    }
}

const detail = async (req, res) => {

    const publication_id = req.params.id;
    if (!publication_id || isNaN(publication_id)) {
        return res.status(400).json({
            status: 'error',
            message: 'No se ha enviado el id de la publicación'
        });
    }

    try {
        let publication = await Publication.findByPk(publication_id, {
            attributes: ['id', 'text', 'createdAt'],
        })

        if (!publication) {
            return res.status(404).json({
                status: 'error',
                message: 'No se ha encontrado la publicación'
            });
        }

        return res.status(200).json({
            status: 'success',
            publication: publication,
            message: 'Información de la publicación',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener la publicación',
            error: error
        });
    }
    
}


const remove = async (req, res) => {

    let publication_id = req.params.id;

    if (!publication_id || isNaN(publication_id)) {
        return res.status(400).json({
            status: 'error',
            message: 'No se ha enviado el id de la publicación'
        });
    }

    try {
        
        let publication = await Publication.findOne({
            where: {
                id: publication_id,
                user_id: req.user.id
            },
            attributes: ['id', 'text', 'createdAt'],
        });

        if (!publication) {
            return res.status(404).json({
                status: 'error',
                message: 'No se ha encontrado la publicación'
            });
        }

        await Publication.destroy({
            where: {
                id: publication.id,
            }
        });



        return res.status(200).json({
            status: 'success',
            message: 'Publicación eliminada',
            publication: publication
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar la publicación',
            error: error
        });
        
    }
}

const user = async (req, res) => {

    const user_id = req.params.id;

    let page = 1;
    if (req.params.page && !isNaN(req.params.page)) {
        page = req.params.page;
    }
    let itemsPerPage = 5;

    try {
        const { count, rows } = await Publication.findAndCountAll({
            where: {
                user_id: user_id
            },
            order: [
                ['id', 'DESC']
            ],
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
            include: [
                {
                    model: User,
                    as: 'user',
                    required: true,
                    attributes: ['id', 'name', 'surname', 'nick']
                }
            ]
        });

        if (count === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No se han encontrado publicaciones',
                publications: []
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Publicaiones del perfil de usuario',
            user: req.user,
            total: count,
            pages: Math.ceil(count / itemsPerPage),
            page: page,
            publications: rows,
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener las publicaciones del usuario',
            error: error
        });
        
    }
}

const upload = async (req, res) => {

    const publication_id = req.params.id;
    if (!publication_id || isNaN(publication_id)) {
        return res.status(400).json({
            status: 'error',
            message: 'No se ha enviado el id de la publicación'
        });
    }

    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: 'No se ha subido la imagen'
        });
    }

    let image = req.file.originalname;
    const image_ext = path.extname(image).toLowerCase();
    const valid_ext = ['.png', '.jpg', '.jpeg'];

    if (!valid_ext.includes(image_ext)) {

        // Eliminar el archivo subido
        const file_path = req.file.path;
        fs.unlinkSync(file_path);

        return res.status(400).json({
            status: 'error',
            message: 'La extensión de la imagen no es válida'
        });
    }

    try {
        let update_upblication = await Publication.update({
            file: req.file.filename
        }, {
            where: {
                user_id: req.user.id,
                id: publication_id

            }
        })

        return res.status(200).json({
            status: 'success',
            message: 'Imagen subida correctamente',
            publication: update_upblication,
            file: req.file.filename
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al subir la imagen',
            error: error
        });
        
    }
}

const media = (req, res) => {
    const file = req.params.file;

    const file_path = './uploads/publications/' + file;
    fs.stat(file_path, (err, stat) => {
        if (err || !stat.isFile()) {
            return res.status(404).json({
                status: 'error',
                message: 'No se ha encontrado el archivo'
            });
        }

        return res.sendFile(path.resolve(file_path));
    });
}

// Listar publicaciones que estamos siguiendo
const feed = async (req, res) => {
    
    let page = 1;
    let itemsPerPage = 5;
    if (req.params.page && !isNaN(req.params.page)) {
        page = req.params.page;
    }

    try {
        const myFollows = await FollowService.followUserIds(req.user.id);

        const publications = await Publication.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    required: true,
                    attributes: ['id', 'name', 'surname', 'nick']
                }
            ],
            where: {
                user_id: myFollows.following
            },
            order: [
                ['id', 'DESC']
            ],
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage

        });

        return res.status(200).json({
            status: 'success',
            message: 'feed',
            myFollows: myFollows.following,
            publications: publications.rows,
            count: publications.count,
            pages: Math.ceil(publications.count / itemsPerPage),
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el feed',
            error: error
        });
        
    }
    
}

module.exports = {
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}