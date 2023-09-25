const { DataTypes } = require('sequelize');
const db = require('../../config/dbconfig');

const Note = db.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

// Sync the model with the database
Note.sync()
  .then(() => {
    console.log('Note model synced with the database.');
  })
  .catch((error) => {
    console.error('Error syncing Note model with the database:', error);
  });

module.exports = Note;
