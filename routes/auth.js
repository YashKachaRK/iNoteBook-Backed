const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fatchuser = require('../middleware/fatchuser')

// CREATE USER
//ROUTE1
router.post(
  '/addUser',
  [
    // get data in json checkk
    body('name', 'Minimum length is 4').isLength({ min: 4 }),
    body('emailid', 'Enter valid email').isEmail(),
    body('password', 'Minimum length is 8').isLength({ min: 8 })
  ],

  async (req, res) => {

    try {
      // VALIDATION
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });

      }

      // CHECK USER
      let user = await User.findOne({
        emailid: req.body.emailid
      });

      if (user) {
        return res.status(400).json({
          success: false,
          error: "Sorry User is already there"
        });
      }
      // password hash with salt
      const salt = await bcrypt.genSalt(10)
      const securePass = await bcrypt.hash(req.body.password, salt)

      // CREATE USER
      user = await User.create({
        name: req.body.name,
        emailid: req.body.emailid,
        password: securePass
      });
      //  payload store data in jwt token 
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)


      // RESPONSE
      res.json({
        success: true,
        message: "User added successfully",
        authToken: authToken
      });

    } catch (error) {

      console.log(error);
      res.status(500).send("Server Error");

    }
  }
);

//ROUTE 2
// Auth User using POST : /api/auth/login . No Login NEed
router.post(
  '/login',
  [
    // get data
    body('emailid', 'Enter valid email').isEmail(),
    body('password', 'Password Cannot be blac').exists(),
  ],

  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // check error
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    // destrucring 
    const { emailid, password } = req.body;
    try {
      // find email id check data is there or not ?
      let user = await User.findOne({ emailid });
      // jo no hoy to error
      if (!user) {
        success: false
        return res.status(400).json({
          error: "Please try to login currect credentaials"
        });
      }
      // password check kare chhe
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Please try to login currect credentaials"
        });
      }

      // data store in jwt token
      const payload = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(payload, JWT_SECRET)
      res.json({
        success: true,
        authToken: authToken,
        user: {
          name: user.name,
          emailid: user.emailid
        }
      });

    } catch (error) {

      console.log(error);
      res.status(500).send("Server Error");
    }
  })

// ROUTE 3 
// AUTH USER GET USER POST : /api/auth/getuser

router.post(
  '/getuser', fatchuser,
  async (req, res) => {
    // data fatch thay chhe using middleware 
    try {
      // get data in fatchuser 
      userId = req.user.id;
      // check id this id in database check data is availble
      // '-password sivay badhu checkk karse'
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }

  })

module.exports = router;