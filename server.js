const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/tic-tac-toe'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/tic-tac-toe/index.html'));
});

console.log(process.env.PORT)
app.listen(process.env.PORT || 4000);
