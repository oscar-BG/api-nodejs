const Publication = require('../models/publication');
const User = require('../models/user');

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
                    attributes: ['id', 'name', 'surname', 'nick', 'email']
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

module.exports = {
    save,
    detail,
    remove,
    user
}