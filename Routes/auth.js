const express = require('express');
const router = express.Router();
const User = require('../Models/User')
const { body, validationResult } = require('express-validator');


//Create a user using: post "/api/auth/".  NO login require
router.post('/', [
    body('name','Enter Valid Name').isLength({ min: 3 }),
    body('email','Enter Valid Email').isEmail({ min: 5 }),
    body('password','Password Must Be 5 Character').isLength({ min: 5 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      }).then(user => res.json(user));
})

module.exports = router