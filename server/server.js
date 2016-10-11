var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyParser.json());
app.use('/',express.static(path.join(__dirname,'../client')));
app.get('/api/place',function(req,res){
	res.type('text/plain');
	res.send('hi');
})

app.listen(8000,function(){
	console.log('listening on 8000');
})