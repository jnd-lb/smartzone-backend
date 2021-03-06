const express = require('express'); 
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const router = express.Router();
const User = require("../../database/model/user");

let db = null;

//bodyparser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

///register route///
router.post("/register", async (req, res) => {

  const isEmailExist = await db.collection("users").findOne({ email: req.body.email });

  // throw error when email already registered
  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
console.log(req.body.name,req.body.email,req.body.password);
  /* const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  user.save()
  .then((user)=>{
    res.status(201).json({ status: 201, data: user})
  })
  .catch((error)=>{
    res.status(500).json({ status: 500, error: true, message: error });
  }) */

   const newUser = {
    name: req.body.name,
    email: req.body.email,
    password,
  }

  db.collection('users').insertOne(newUser, (err, results) => {
      if (err) res.status(500).json({ status: 500, error: true, message: "internal error" });
      res.status(201).json({ status: 201, data: results["ops"][0] });
  }); 
});



// login route
router.post("/", async (req, res) => {   
  //check if email is found
  const user = await db.collection("users").findOne({ email: req.body.email });  
  
  // throw error when email is wrong
  if (!user) return res.status(400).json({ status:400, error:true, message: "email is wrong" }); 

  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);  
    // throw error when email is wrong
  if (!validPassword)
  return res.status(400).json({ status:400, error:true, message:"Password is wrong" });

  //jwt 
  const token = jwt.sign({ email: req.body.email }, config.JWT_PRIVATE_KEY, {expiresIn: "1h"});

  res.status(200).json({
    status:200,
    error:false,
    message: "login succeed",
    name:user.name,
    token:token
  }); 
});


module.exports= (_db)=>{
    db = _db;
    return router;
}