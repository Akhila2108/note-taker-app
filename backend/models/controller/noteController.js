const Note = require('../entity/note');


// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const note = await Note.create({ title, description, category });
    res.status(201).json({ message: 'Note added successfully', note });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all notes
const fetchAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateNote = async (req,res) => {
  const noteId = req.params.id;
  const { title, category, description } = req.body;

  try {
    const note = await Note.findByPk(noteId);

    if (note) {
      await note.update({
        title,
        category,
        description
      });

      console.log('Note updated in MySQL');
      console.log(req.body);
      res.status(200).json({ message: 'Note updated successfully' });
    } else {
      console.log('Note not found in MySQL');
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteNote = async (req,res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findByPk(noteId);
    
    if (note) {
      await note.destroy();
      console.log('Note deleted from MySQL');
      res.status(200).json({ message: 'Note deleted successfully' });
    } else {
      console.log('Note not found in MySQL');
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  createNote,
  fetchAllNotes,
  updateNote,
  deleteNote,
};
