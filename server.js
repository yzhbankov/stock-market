/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */
var express = require('express');

var app = express();

app.use('/', express.static('public'));

app.get('/', function(req, res){
    res.sendFile("index.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Listening port 3000');
});

