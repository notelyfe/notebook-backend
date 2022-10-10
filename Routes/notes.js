const express = require('express');
const router = express.Router();
var fetchuser = require('../Middleware/fetchuser')
const Notes = require('../Models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: get all notes: get "/api/notes/fetchnotes". login require
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

//Route 2: aad a notes: post "/api/notes/addnotes". login require
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
        res.status(500).send('Internal server error');
    }
})

//Route 3: update an existing note: put"/api/notes/updatenotes". login require
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create a new note object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated and updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }

})

//Route 4: Delete an existing note: delete"/api/notes/deletenote" login require
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //find the note to be deleted
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found")
        }

        //allow deletion only if user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Succes": "Note has been deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router