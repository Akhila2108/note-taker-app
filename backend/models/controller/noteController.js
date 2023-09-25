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

// Update a note by ID
// const updateNote = async (req, res) => {
//   const noteId = req.params.id;
//   const { title, category, description } = req.body;

//   try {
//     const note = await Note.findByPk(noteId);

//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     await note.update({ title, category, description });
//     res.status(200).json({ message: 'Note updated successfully', note });
//   } catch (error) {
//     console.error('Error updating note:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const updateNoteApi = async (noteId, updatedNote) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    });

    console.log('API Response:', response);  // Add this line

    if (!response.ok) {
      throw new Error('Failed to update note');
    }
  } catch (error) {
    throw new Error(`Error updating note: ${error.message}`);
  }
};


// app.put('/api/notes/:id', async (req, res) => {
//   const noteId = req.params.id;
//   const { title, category, description } = req.body;

//   try {
//     const note = await Note.findByPk(noteId);

//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     await note.update({ title, category, description });
//     res.status(200).json({ message: 'Note updated successfully', note });
//   } catch (error) {
//     console.error('Error updating note:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// Delete a note by ID
const deleteNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findByPk(noteId);
    if (note) {
      await note.destroy();
      res.status(200).json({ message: 'Note deleted successfully' });
    } else {
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
