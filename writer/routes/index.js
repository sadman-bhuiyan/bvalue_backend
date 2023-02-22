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
    console.log(user)
    console.log(req.user)

    req.user = user

    next()
  })
}

router.post('/profile',  function (req, res, next) {
    try{
    const {user_id, name, surname, birthdate, gender, birthcity } = req.body;
    
    handlerDB.createProfile(user_id, name, surname, birthdate, gender, birthcity);
    res.json({ message: "User details saved successfully!" })

    }catch(err){
        res.status(401).send(err.message);
    }
});

router.get('/profile', authenticateToken, function (req, res, next) {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    
    //handlerDB.createProfile(name, surname, birthdate, gender, birthcity);
    res.json({ message: token})

    }catch(err){
        res.status(401).send(err.message);
    }
});

module.exports = router;
