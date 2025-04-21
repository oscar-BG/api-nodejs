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

module.exports = {
    save
}