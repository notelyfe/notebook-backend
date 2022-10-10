const express = require('express');
const router = express.Router();
const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require('../Middleware/fetchuser')

const JWT_SECRET = 'noteissmart'

//Route 1: Create a user using: post "/api/auth/createuser".  NO login require
router.post('/createuser', [
    body('name', 'Enter Valid Name').isLength({ min: 3 }),
    body('email', 'Enter Valid Email').isEmail({ min: 5 }),
    body('password', 'Password Must Be 5 Character').isLength({ min: 5 }),
], async (req, res) => {

    //if error, return Bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //check whether user with the email exist already

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with this email already exist' })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        //create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        res.json({ authtoken })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');
    }
})

//Route 2: authenticate a user using post "/api/auth/login" no login require

router.post('/login', [
    body('email', 'Enter Valid Email').isEmail({ min: 5 }),
    body('password', 'Password cannot be blank').exists({ min: 5 })
], async (req, res) => {
    //if error, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials' })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: 'Invalid Credentials' })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');
    }
})

//Route 3: get loggedin user details using Post "/api/auth/getuser" login require
router.post('/getuser', fetchuser,  async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router