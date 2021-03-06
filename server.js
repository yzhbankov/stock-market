/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */
var express = require('express');
var app = express();
var https = require('https');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
//var mongoUrl = 'mongodb://localhost:27017/stock_market';
var mongoUrl = 'mongodb://yzhbankov:password1360@ds151018.mlab.com:51018/heroku_xgxc5fqc';
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile("index.html");
});

app.get('/stock', function (req, res) {
    io.emit('stock', 'sdfasfdasfsfasfasdf');
    MongoClient.connect(mongoUrl, function (err, db) {
        db.collection('stocks').find().toArray(function (err, items) {
            if (!items) {
                db.close();
                console.log("no stocks");
                res.send(null);
            } else {
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
                                "stockDescription": obj.dataset.name,
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

app.get('/deletestock/:stockname', function (req, res) {
    var stockname = req.params.stockname;

    MongoClient.connect(mongoUrl, function (err, db) {
        db.collection('stocks').remove({"stockname": stockname});
        console.log('stock removed');
        db.close();
        res.redirect('/');
    });

});

io.on('connection', function (socket) {
    console.log('connected');
    socket.on('change', function(){
        socket.broadcast.emit('update');
    })
});

server.listen(process.env.PORT || 3000, function () {
    console.log('Listening port 3000');
});
