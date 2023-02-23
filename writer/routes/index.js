const express = require('express');
const router = express.Router();
const handlerDB = require('../handlers/handlerdb');
const handlerMQ = require('../handlers/handlermq');
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

router.put('/profile', authenticateToken, async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const { user_id, name, surname, birthdate, gender, birthcity } = req.body;
        let role = Object.values(await handlerDB.getRole(req.user.id))[0].user_role

        if (role == 'user') {
            await handlerDB.modifyProfile(req.user.id, name, surname, birthdate, gender, birthcity);
            await handlerMQ.sendData({action: "modify_profile", user_id:req.user.id, name:name, surname:surname, birthdate:birthdate, gender:gender, birthcity:birthcity})
            res.json({ message: "User details saved successfully!" })
            //res.json({message: "You don't have permission to do this operation! Contact admin"})
        } else if (role == 'admin') {
            await handlerDB.modifyProfile(user_id, name, surname, birthdate, gender, birthcity);
            await handlerMQ.sendData({action: "modify_profile", user_id:user_id, name:name, surname:surname, birthdate:birthdate, gender:gender, birthcity:birthcity})
            res.json({ message: "User details saved successfully!" })
        }

        

    } catch (err) {
        res.status(401).send(err.message);
    }
});

router.delete('/profile', authenticateToken, async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const { user_id } = req.body;
        let role = Object.values(await handlerDB.getRole(req.user.id))[0].user_role

        if (role == 'user') {
            res.json({message: "You don't have permission to do this operation! Contact admin"})
        } else if (role == 'admin') {
            await handlerDB.deleteProfile(user_id);
            await handlerDB.deleteRole(user_id);
            await handlerMQ.sendData({action: "delete_profile", user_id:user_id})
            res.json({ message: "User details deleted successfully!" })
        }

        

    } catch (err) {
        res.status(401).send(err.message);
    }
});


module.exports = router;
