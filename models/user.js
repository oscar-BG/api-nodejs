const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('User', {
    name : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    surname : {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    bio :{
        type: DataTypes.STRING(255),
        allowNull: true
    },
    nick : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role : {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'role_user'
    },
    password : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image : {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'default.png'
    }
}, {
    timestamps : true
})



module.exports = User;