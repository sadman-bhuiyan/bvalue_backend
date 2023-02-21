const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const handlerDB = require('../handlers/handlerdb')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


dotenv.config()

const generateAcessToken = (email) => {
  return jwt.sign({email: email}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 })
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

    handlerDB.createUser(email, hash);

    res.json({ message: "User registred successfully!" })
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.post('/login', async(req,res) => {
  try{
    const {email, password} = req.body;

    let user = await handlerDB.getUser(email);

    if(user.length == 0){
      return res.status(401).json({message: "Invalid email or password!"});
    }


    let hash = Object.values( await handlerDB.getUser(email))[0].hashed_password

    if(bcrypt.compareSync(password, hash)){
      let token = generateAcessToken(email);
      res.json({token})
    }else{
      return res.status(401).json({message: "Invalid email or password!"});
    }

  }catch(err){
    res.status(401).send(err.message);
  }
})



module.exports = router;
