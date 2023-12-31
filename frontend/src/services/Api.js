// noteApi.js

const API_BASE_URL = 'http://localhost:3000/api/notes'; // Replace with your server URL

export const createNoteApi = async (noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};



export const fetchAllNotesApi = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/notes", {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notes. HTTP status ' + response.status);
    }

    const notes = await response.json();
    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
};


export const updateNoteApi = async (noteId, updatedNote) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    });

    if (!response.ok) {
      console.error('Failed to update note. Response status:', response.status);
      const errorMessage = await response.text();
      console.error('Error message from server:', errorMessage);
      throw new Error('Failed to update note');
    }
  } catch (error) {
    console.error('Error updating note:', error.message);
    throw new Error(`Error updating note: ${error.message}`);
  }
};




// services/DeleteNoteApi.js

export const deleteNoteApi = async (noteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  } catch (error) {
    throw new Error(`Error deleting note: ${error.message}`);
  }
  // No need to return any data for deleting a note
};