const Follow = require('../models/follow');
const User = require('../models/user');

const save = async (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Follow guardado"
    })
}

module.exports = {
    save
}