const Publication = require('../models/publication');

const save = async (req, res) => {
    return res.status(200).json({
        message: 'save publication'
    });
}

module.exports = {
    save
}