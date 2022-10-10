const express = require('express');
const router = express.Router();
var fetchuser = require('../Middleware/fetchuser')
const Notes = require('../Models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: get all notes: get "/api/auth/fetchnotes". login require
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');
    }
})

//Route 2: aad a notes: post "/api/auth/addnotes". login require
router.post('/addnotes', fetchuser, [
    body('title', 'Enter Valid title').isLength({ min: 3 }),
    body('description', 'Enter description').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //if error, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');
    }

})

module.exports = router