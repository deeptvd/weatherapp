const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const port = 3000;

//Body Parser Middleware
app.use(bodyParser.json());

//Index Route
app.get('/', (req, res) => {
  res.send("INDEX");
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});