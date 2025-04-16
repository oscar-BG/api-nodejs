const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./user');

const Follow = sequelize.define('Follow', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
})

// Relacion con el modelo de usuario

User.hasMany(Follow, {
    foreignKey: 'user_id',
    as: 'following' // usuarios que este user sigue
});

User.hasMany(Follow, {
    foreignKey: 'followed_id',
    as: 'followers' // usuarios que siguen a este user
});

// Y también puedes vincular desde Follow hacia User
Follow.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'follower' // quien sigue
});

Follow.belongsTo(User, {
    foreignKey: 'followed_id',
    as: 'followed' // a quién sigue
});

module.exports = Follow;