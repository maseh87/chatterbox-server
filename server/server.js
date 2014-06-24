var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var storage = {};
storage.results = [];

app.use(express.static('../client/client'));
app.use(bodyParser.json());
app.post('/classes/messages', function(req, res){
  var temp = req.body;
  temp.createdAt = new Date();
  storage.results.push(req.body);
  res.send(201);

});
app.get('/classes/messages', function(req, res){
  res.send(storage);
});



app.listen(3000);
console.log('listening on port 3000');


