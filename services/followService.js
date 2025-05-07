const { where } = require('sequelize');
const Follow  = require('../models/follow');

const followUserIds = async (identityUserId) => {
    let following = await Follow.findAll({
        where: {
            user_id: identityUserId
        },
        attributes: ['followed_id'],
    });

    let following_clean = following.map(f => f.followed_id);

    let followers = await Follow.findAll({
        where: {
            followed_id: identityUserId
        },
        attributes: ['user_id'],
    });

    let followers_clean = followers.map(f => f.user_id);

    return {
        following: following_clean,
        followers: followers_clean
    }
}

const followThisUser = async (identityUserId, profileUserId) => {

    try {
        
        let followind = await Follow.findOne({
            where: {
                user_id: identityUserId,
                followed_id: profileUserId
            },
            attributes: ['followed_id']
        });
    
        let follower = await Follow.findOne({
            where: {
                user_id: profileUserId,
                followed_id: identityUserId
            },
            attributes: ['user_id']
        });
    
        return {
            following: followind ? followind : false,
            follower: follower ? follower : false
        }

    } catch (error) {
        console.log(error);
        return {
            status: "error",
            message: "Error en el servidor",
        }
    }
}

module.exports = {
    followUserIds,
    followThisUser
}