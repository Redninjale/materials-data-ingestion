const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 8000;

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.send("hello world");
})

// app.use(express.static(path.join(__dirname, 'frontend/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});