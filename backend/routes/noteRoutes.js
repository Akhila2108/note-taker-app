const express = require('express');
const router = express.Router();
const {
  createNote,
  fetchAllNotes,
  updateNote,
  deleteNote,
} = require('../models/controller/noteController');

router.post('/api/notes', createNote);
router.get('/api/notes', fetchAllNotes);
router.put('/api/notes/:id', updateNote);
router.delete('/api/notes/:id', deleteNote);

module.exports = router;
