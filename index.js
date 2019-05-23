const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  

app.use('/', express.static(__dirname));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
});

// app.get('/*.html', (req, res) => {
//   res.sendFile(path.join(__dirname, './views', req.url));
// })

app.listen(3001, () => console.log('listening on port 3001'));