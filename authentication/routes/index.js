const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const handlerDB = require('../handlers/handlerdb')
const handlerMQ = require('../handlers/handlermq')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


dotenv.config()

const generateAcessToken = (id) => {
  return jwt.sign({id: id}, process.env.TOKEN_SECRET, { expiresIn: 3000 })
}
const generateRefreshToken = (id) => {
  return jwt.sign({id: id}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 })
}

router.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password } = req.body;
  

    let user = await handlerDB.getUser(email);

    if (user.length > 0) {
      res.status(401).json({ message: "User already exist. Did you forget your password?" })
      return;
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);

    const hash = bcrypt.hashSync(password, saltRounds);

    let id = await handlerDB.createUser(email, hash);
    await handlerDB.createRole("user",id.id)
    await handlerMQ.sendData({action: "create_role", id: id.id})
    await handlerMQ.sendData({action: "create_profile", id: id.id})
    res.json({ message: "Your account has been created" })
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.post('/login', async(req,res) => {
  try{
    const {email, password} = req.body;

    let user = Object.values(await handlerDB.getUser(email));

    if(user.length == 0){
      return res.status(401).json({message: "Invalid email or password!"});
    }


    let hash = user[0].hashed_password

    if(bcrypt.compareSync(password, hash)){
      let token = generateAcessToken(user[0].id);
      if(Object.values(handlerDB.getRefreshToken(user[0].id).length == 0)){
        await handlerDB.insertRefreshToken(user[0].id, generateRefreshToken(user[0].id))
      }
      res.json({token})
    }else{
      return res.status(401).json({message: "Invalid email or password!"});
    }

  }catch(err){
    res.status(401).send(err.message);
  }
})



module.exports = router;
