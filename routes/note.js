const express = require('express');
const router = express.Router();
const fatchuser = require('../middleware/fatchuser')
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// route 1  : get all notes using GET "/api/note/getallnotes"
router.get('/fatchallnotes', fatchuser, async (req, res) => {
  // fatch all note and also check user id related noted fatched
  const notes = await Notes.find({ user: req.user.id })
  res.json(notes)


});

// route 2 :  add notes POST : "/api/note/addnotes"

router.post('/addnote',
  fatchuser,
  [
    body('title', 'Minimum length is 5').isLength({ min: 5 }),
    body('description', 'Atleast one word need').exists(),
    body('tag', 'Minimum length is 4').isLength({ min: 4 })
  ],
  async (req, res) => {
    try {

      const { title, description, tag } = req.body
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }


      // create new note
      // notes create
      const note = new Notes({
        title, description, tag, user: req.user.id
      })
      // notes save in database 
      const saveNotes = await note.save()
      res.json(saveNotes)
    } catch (error) {
      // VALIDATION
      console.log(error);
      res.status(500).send("Server Error");
    }
  })

// route 3 :  update notes POST : "/api/note/addnotes"
router.put('/updatenote/:id',
  fatchuser,
  [
    body('title', 'Minimum length is 5').isLength({ min: 5 }),
    body('description', 'Atleast one word need').notEmpty(),
    body('tag', 'Minimum length is 4').isLength({ min: 4 })
  ],
  async (req, res) => {
    try {

      const { title, description, tag } = req.body
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }


      const newNote = {}
      if (title) { newNote.title = title }
      if (description) { newNote.description = description }
      if (tag) { newNote.tag = tag }

      // note id check kari chhe ahiya
      let  note =await  Notes.findById(req.params.id);
      if (!note) {
        return  res.status(404).json("Not Found")
      }

      // user check kari chhi // Check ownership

      if (note.user.toString() !== req.user.id) {
        return res.status(401).json("Now Allowed")
      }

      note = await Notes.findByIdAndUpdate(req.params.id , {$set: newNote} ,{ returnDocument: "after" })

      res.send(note)

    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  })

// route 3 :  delete notes POST : "/api/note/addnotes"
router.delete('/deletenote/:id',
  fatchuser,
  async (req, res) => {
    try {

     
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }


     

      // note id check kari chhe ahiya
      let  note =await  Notes.findById(req.params.id);
      if (!note) {
        return  res.status(404).json("Not Found")
      }

      // user check kari chhi // Check ownership

      if (note.user.toString() !== req.user.id) {
        return res.status(401).json("Now Allowed")
      }

      note = await Notes.findByIdAndDelete(req.params.id)

      res.json ({" Success" : "Note Hase been deleted"})

    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  })



module.exports = router