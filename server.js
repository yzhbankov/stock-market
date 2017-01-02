/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */
var express = require('express');
var app = express();
var https = require('https');

app.use('/', express.static('public'));


app.get('/', function (req, res) {
    res.sendFile("index.html");
});

app.get('/stock', function (req, res) {
    var apiKey = "zpY11hn5Z2iCF1n4hHwt";
    var startDate = '2014-01-01';
    var endDate = '2014-12-31';
    var stockName = 'IBM';
    var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&collapse=daily&transform=diff&api_key=' + apiKey;
    https.get(url, function (response) {
        var output = '';
        response.setEncoding('utf8');
        response.on('data', function (body) {
            output += body;
        });
        response.on('end', function () {
            var obj = JSON.parse(output);
            res.send(obj);
        });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening port 3000');
});

