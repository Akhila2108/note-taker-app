const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/noteRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
