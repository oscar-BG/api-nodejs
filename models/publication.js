const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");
const User = require("./user");

const Publication = sequelize.define("Publication", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    text : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file : {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
})

User.hasMany(Publication, {
    foreignKey: 'user_id',
    as: 'publications' // publicaciones de este user
})

Publication.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user' // usuario que hizo la publicación
})

module.exports = Publication;