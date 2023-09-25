import React, { useState, useEffect } from 'react';
import { createNoteApi, fetchAllNotesApi, updateNoteApi, deleteNoteApi } from '../services/CreateNoteApi';
import '../styles/Note.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import image from '../assets/download.png';


const Note = () => {
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByCategory, setSearchByCategory] = useState('');
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [showTitleError, setShowTitleError] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [noNotesMessage, setNoNotesMessage] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setNoteToEdit(null);
  };

  const fetchNotes = async () => {
    try {
      const data = await fetchAllNotesApi();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
    }
  };

  useEffect(() => {
    fetchNotes();  // Fetch notes when the component mounts
  }, []);
  const handleCreateNote = async () => {
    if (!title) {

      setShowTitleError(true);
      return;
    }
    if (!category) {
      setCategoryError(true);
      return;
    }
    try {
      const newNote = {
        id: Date.now(),
        title,
        description,
        category,
      };

      await createNoteApi(newNote);
      setNotes([...notes, newNote]);

      // Reset form fields and close the modal
      setTitle('');
      setDescription('');
      setCategory('');
      handleClose();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find((note) => note.id === noteId);

    setTitle(noteToEdit.title);
    setDescription(noteToEdit.description);
    setCategory(noteToEdit.category);

    setNoteToEdit(noteToEdit);
    setShowModal(true);
  };



  const handleEditSubmit = async () => {
    try {
      const editedNote = {
        title,
        description,
        category,
      };

      // Call the API to update the note
      await updateNoteApi(noteToEdit.id, editedNote);

      // Update the notes state with the edited note
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteToEdit.id ? { ...note, ...editedNote } : note))
      );

      // Reset form fields and close the modal
      setTitle('');
      setDescription('');
      setCategory('');
      handleClose();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };
  const filterNotes = (query) => {
    const filteredNotes = notes.filter((note) => {
      const searchQueryLower = query.toLowerCase();
      const noteTitleLower = note.title.toLowerCase();
      return noteTitleLower.includes(searchQueryLower);
    });

    setFilteredNotes(filteredNotes);

    // Display "No Notes with such name" message if there are no matching notes
    if (query && filteredNotes.length === 0) {
      setNoNotesMessage('No Notes with such name.');
    } else {
      setNoNotesMessage(null);
    }
  };

 
  const handleDeleteNote = async (noteId) => {
    try {
      // Call the API to delete the note
      await deleteNoteApi(noteId);

      // Remove the deleted note from the notes state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };



  const filteredNotesByTitle = notes.filter((note) => {
    const searchQueryLower = searchQuery.toLowerCase();
    const noteTitleLower = note.title.toLowerCase();

    // Check if the note title starts with the title search query
    return noteTitleLower.startsWith(searchQueryLower);
  });
   
  // Filter notes based on the category search query
  const filteredNotesByCategory = notes.filter((note) => {
    const searchByCategoryLower = searchByCategory.toLowerCase();
    const noteCategoryLower = note.category.toLowerCase();

    // Check if the note category includes the category search query
    return noteCategoryLower.includes(searchByCategoryLower);
  });

  const activeFilteredNotes = activeSearchField === 'title' ? filteredNotesByTitle : filteredNotesByCategory;

  return (
    <div className="note-app">
      <div className="header">
        <h1 className="note-heading">Note Taking App</h1>
        <img src={image} alt="Note Icon" className="note-icon" />

      </div>

      <div className="space">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setActiveSearchField('title'); // Set the active search field to 'title'
          }}
          className="search-input"
        />
        {noNotesMessage && <div className="no-notes-message">{noNotesMessage}</div>}
        {/* Add a new input field for category search */}
        <input
          type="text"
          placeholder="Search by folder name..."
          value={searchByCategory}
          onChange={(e) => {
            setSearchByCategory(e.target.value);
            setActiveSearchField('category'); // Set the active search field to 'category'
          }}
          className="search-input"
        />

        <button onClick={handleShow} className="create-button">
          Create Note
        </button>
      </div>

      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="headers">
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setShowTitleError(false);
                }}
                className={`form-control ${showTitleError ? 'error' : ''}`}
                required // This is not a native "required" attribute, but we'll use it for custom validation
              />
              <input
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCategoryError(false); // Reset category error when user types in the category
                }}
                className={`form-control ${categoryError ? 'error' : ''}`} // Apply error class based on categoryError state
                required
              />
            </div>

            <textarea
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              id="description-box"
            />
            <div className="modal-footer">
              <button onClick={handleClose} className="modal-close-btn">
                Cancel
              </button>
              <button
                onClick={noteToEdit ? handleEditSubmit : handleCreateNote}
                className="modal-submit-btn"
              >
                {noteToEdit ? 'Save Note' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )
      }

      <div className="card-container">
        {/* Display notes filtered by the active search field */}
        {activeFilteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            {/* ... (existing code) */}
            <div className="card-body">
              <div className="card-subtitle">{note.category}</div>
              <div className="card-title">{note.title}</div>
              <div className="card-text">{note.description}</div>

              <div className="card-buttons">
                <span id="edit-btn" onClick={() => handleEditNote(note.id)}>
                  <i className="bi bi-pencil-fill"></i>
                </span>
                <span className="icon-button" onClick={() => handleDeleteNote(note.id)}>
                  <i className="bi bi-trash-fill"></i>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div class="background-circle"></div>
    </div >
  );
};

export default Note;
