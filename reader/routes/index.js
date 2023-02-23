const express = require('express');
const router = express.Router();
const handlerDB = require('../handlers/handlerdb');
const jwt = require('jsonwebtoken');



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403);

        req.user = user

        next()
    })
}

router.get('/profile', authenticateToken, async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        let role = Object.values(await handlerDB.getRole(req.user.id))[0].user_role
        let data;
        if (role == 'user') {
            data = await handlerDB.getProfile(req.user.id)
        } else if (role == 'admin') {
            data = await handlerDB.getAllProfiles()
        }


        res.json({ profiles: data })

    } catch (err) {
        res.status(401).send(err.message);
    }
});

module.exports = router;
