const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (!req.cookies.xtn) {
        res.status(401).send({message: "Unauthorized. No Token Provided!"})
    } else {
        jwt.verify(
            req.cookies.xtn, process.env.XTNCIPH, async (err, decoded) => {
                if (!err) {
                    next();
                } else {
                    console.log(err.message)
                    res.status(500).send({error: err.message})
                }
            }
        )
    }
}