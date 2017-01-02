/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */
var express = require('express');
var app = express();
var https = require('https');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/stock_market';

app.use('/', express.static('public'));


app.get('/', function (req, res) {
    res.sendFile("index.html");
});

app.get('/stock', function (req, res) {

    /*var apiKey = "zpY11hn5Z2iCF1n4hHwt";
     var startDate = '2014-01-01';
     var endDate = '2016-12-31';
     var stockName = 'amzn';
     var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&collapse=monthly&api_key=' + apiKey;

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
     });*/
    MongoClient.connect(mongoUrl, function (err, db) {
        db.collection('stocks').find().toArray(function (err, items) {
            if (!items) {
                db.close();
                console.log("no stocks");
                res.send(null);
            } else {
                console.log(items);
                res.send(items);
            }
        });
    });
});

app.get('/addstock/:stockname/:start/:end', function (req, res) {
    var apiKey = "zpY11hn5Z2iCF1n4hHwt";
    var startDate = req.params.start; //'2014-01-01';
    var endDate = req.params.end; //'2016-12-31';
    var stockName = req.params.stockname;
    var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&collapse=monthly&api_key=' + apiKey;
    https.get(url, function (response) {
        var output = '';
        response.setEncoding('utf8');
        response.on('data', function (body) {
            output += body;
        });
        response.on('end', function () {
            var obj = JSON.parse(output);
            if (obj.quandl_error) {
                console.log('incorrect stock name');
                res.send(null)
            } else {
                MongoClient.connect(mongoUrl, function (err, db) {
                    db.collection('stocks').findOne({"stockname": obj.dataset.dataset_code}, function (err, item) {
                        if (item) {
                            db.close();
                            console.log("stock find");
                            res.send(null)
                        } else {
                            db.collection('stocks').insertOne({
                                "stockname": obj.dataset.dataset_code,
                                "stockDescription": obj.dataset.description,
                                "data": obj.dataset.data
                            }, function (err, result) {
                                if (!err) {
                                    console.log("stock added successfuly");
                                    db.close();
                                    res.send(null);
                                }
                            });
                        }
                    });
                });
            }
        });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening port 3000');
});

