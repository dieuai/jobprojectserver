var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var async = require('async');

try {
    var config = require("./configs/config");
    require('./configs/mongo_connection');
    var vieclam24h = require('./routes/Crawler/vieclam24h');
    var timviecnhanh = require('./routes/Crawler/timviecnhanh');
    var query = require('./routes/Job_Management/Query');
    var careerbuilder = require('./routes/Crawler/careerbuilder');
    var mywork = require('./routes/Crawler/mywork.js');
    var vietnamworks = require('./routes/Crawler/vietnamworks');
    var intership = require('./routes/Crawler/intership');
}
catch (err) {
    console.log('err:', err);
}

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cors());

try {
    //app.use('/',vieclam24h);
    app.use('/',timviecnhanh);
    app.use('/',query);
    app.use('/',careerbuilder);
    app.use('/',mywork);
    //app.use('/',vietnamworks);
    app.use('/',intership);
}
catch (err) {
    console.log('err', err);
}

app.use(function (res, req, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });

});

var http = require('http').Server(app);
var io = require('socket.io').listen(http);

io.on('connection', function (socket) {

});

http.listen(config.production_port, function () {
    console.log('ITJob running on port: ' + config.production_port);
});

setInterval(function(){
    autoCrawler();
}, 60000);

function autoCrawler(){
    var date = new Date();
    if(date.getHours() == 22 && date.getMinutes() == 31){
        async.waterfall([
            function (next){
                vietnamworks.vietnamworks(next);
            },

            function (next){
                vieclam24h.vieclam24h(next);
            },

            function (next){
                timviecnhanh.timviecnhanh(next);
            },

            function (next){
                mywork.mywork(next);
            }
        ]);
    }
};

module.exports = app;
