const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config()

const generateAcessToken = (email) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '3000s' })
}

router.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let isUser = await handlerDB.checkUser(email);

    if (isUser) {
      res.status(401).json({ message: "User already exist. Did you forget your password?" })
      return;
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);

    const hash = bcrypt.hashSync(password, saltRounds);

    handlerDB.createUser(username, hash);

    res.json({ message: "User registred successfully!" })
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.post('/login', async(req,res) => {
  try{
    const {email, password} = req.body;

    let isUser = await handlerDB.checkUser(email);

    if(!isUser){
      return res.status(401).json({message: "Invalid email or password!"});
    }

    if(bcrypt.compareSync(password, hash)){
      let token = generateAcessToken(email);
      res.json({token})
    }

  }catch(err){
    res.status(401).send(err.message);
  }
})

module.exports = router;
