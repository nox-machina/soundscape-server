const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verify = require('../middleware/verify');


//-- models --//
const User = require('../models/user');

//-- custom methods --//
const findUsername = (requestedUser) => {
    return User.findOne({username: requestedUser})
}

const findEmail = (requestedEmail) => {
    return User.findOne({email: requestedEmail})
}
//-- end of custom methods --//

//-- Signup --//
router.post('/register', async (req, res) => {
    const isUsernameTaken = await findUsername(req.body.username);
    if (isUsernameTaken) {
        return res.status(409).send({message: "Username taken."});
    }

    const isEmailTaken = await findEmail(req.body.email);
    if (isEmailTaken) {
        return res.status(409).send({message: "Email already registered."})
    }

    let newUser;

    try {
        const salt = await bcrypt.genSalt(12);
        const seasonedPass = await bcrypt.hash(req.body.password, salt);

        newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: seasonedPass
        });

        await newUser.save();

    } catch (error) {
        res.status(500).send({error: "Whoa. Something went wrong while signing up."});
    }
    finally {
        const payload = {
            user: {
                id: newUser._id
            }
        }

        let date = new Date();
        let time = date.getTime();

        jwt.sign(payload, process.env.XTNCIPH, {expiresIn: 60}, async (err, xtn) => {
            if (!err) {
                date.setTime(time + 60000)
                console.log({date: date})

                res.cookie("xtn", xtn, {
                    domain: "*",
                    secure: false,
                    httpOnly: true,
                    expires: date
                }).status(201).send(newUser)
            }
        })
    }
});

//-- login --//
router.post('/auth', verify, async (req, res) => {
    res.send({ msg: "verified!" });
})


module.exports = router;
