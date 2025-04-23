const Follow = require('../models/follow');
const User = require('../models/user');

const save = async (req, res) => {

    const userToFollowId = req.body.followed_id;
    const userId = req.user.id;

    try {
        let userToFollow = await Follow.create({
            user_id: userId,
            followed_id: userToFollowId,
        });
    
        return res.status(200).json({
            status: "success",
            message: "Follow guardado",
            user : userId,
            followed: userToFollow,
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        })
        
    }
}

const unFollow = async (req, res) => {
    const userId = req.user.id;
    const userToUnfollowId = req.params.id;

    try {

        const userToUnFollow = await Follow.destroy({
            where: {
                user_id: userId,
                followed_id: userToUnfollowId,
            }
        });

        return res.status(200).json({
            status: "success",
            message: "Unfollow guardado",
            identity : req.user,
            userToUnFollow : userToUnFollow,
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        })
        
    }
}

const following = async (req, res) => {

    const page = req.params.page ? req.params.page : 1;
    const itemsPerPage = 5;
    const offset = (page - 1) * itemsPerPage;
    const userId = req.params.id ? req.params.id : req.user.id;

    try {

        const total = await Follow.count({
            where: {
                user_id: userId
            }
        });

        const listFollowing = await Follow.findAll({
            include: [
                {
                    model: User,
                    as: 'followed',
                    required: true,
                    attributes: ['id', 'name', 'surname', 'nick', 'email', 'image'],
                },
                {
                    model: User,
                    as: 'follower',
                    required: true,
                    attributes: ['id', 'name', 'surname', 'nick', 'email', 'image'],
                }
            ],
            where: {
                user_id: userId
            },
            attributes: ['id', 'user_id', 'followed_id'],
            limit: itemsPerPage,
            offset: offset,
            order: [['id', 'DESC']]
        });
    
    
        return res.status(200).json({
            status: "success",
            message: "Listado de usuarios que estoy siguiendo",
            following: listFollowing,
            total: total,
            page: page,
            items: itemsPerPage,
            pages : Math.ceil(total / itemsPerPage)
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        })
    }

}

const followers = async (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Listado de usuarios que me siguen",
    });
}


module.exports = {
    save,
    unFollow,
    following,
    followers,
}