const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);
// app.get('/', (req, res) => {
//   res.send("hello world");
// })

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://triple-hour-287219.uc.r.appspot.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});