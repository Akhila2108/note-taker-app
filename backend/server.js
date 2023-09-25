const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mahadeva',
  database: 'note',
  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.post('/api/notes', (req, res) => {
  const { title, description, category } = req.body;

  const sql = 'INSERT INTO notes (title, category, description) VALUES (?, ?, ?)';
  db.query(sql, [title, category, description], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Note added to MySQL');
      res.status(201).json({ message: 'Note added successfully' });
    }
  });
});
app.get('/api/notes', async (req, res) => {
  try {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, notes) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(notes);
      }
    });
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, category, description } = req.body;

  const sql = 'UPDATE notes SET title=?, category=?, description=? WHERE id=?';

  db.query(sql, [title, category, description, noteId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Note updated in MySQL');
      console.log(req.body);
      res.status(200).json({ message: 'Note updated successfully' });
    }
  });
});


app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  const sql = 'DELETE FROM notes WHERE id = ?';
  db.query(sql, [noteId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Note deleted from MySQL');
      res.status(200).json({ message: 'Note deleted successfully' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
