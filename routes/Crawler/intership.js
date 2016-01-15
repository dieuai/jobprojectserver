var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var Job = require('../../models/Jobs');
var check = [];

//start();
//
//function start() {
//    var url = 'http://internship.edu.vn/vi/component/tpjobs/searchbyspec/44-cntt%7Cinformation-technology?start=';
//    for (var u = 0; u < 100; u++) {
//        viecLam(url, u);
//    }
//}
//
//function viecLam(url, i) {
//    request(url + i, function (err1, resp1, body) {
//        if (!err1 && resp1.statusCode == 200) {
//            var $ = cheerio.load(body);
//            check.push('1');
//            $('.col-sm-9.col-sm-pull-3').each(function(){
//                if (urls.indexOf($(this).children('div').first().children('a').attr('href')) > -1) {
//                }
//                else {
//                    urls.push($(this).children('div').first().children('a').attr('href'));
//                }
//            });
//            if (check.length == 100) {
//                console.log(urls.length);
//                for (var i = 0; i < urls.length; i++) {
//                    getLinks(urls[i]);
//                }
//            }
//        }
//    });
//}

//getLinks('http://internship.edu.vn/vi/component/tpjobs/detailjob/23307-tuy%E1%BB%83n-th%E1%BB%B1c-t%E1%BA%ADp-sinh-cntt-3-2016');

function getLinks(url) {
    var job = {
        page: 'http://internship.edu.vn/',
        link: '' + url,
        diachilienhe: url
    };

    request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            console.log(body);
        }
        if (Object.keys(job).length > 3) {
            console.log(job);
            //var result = new Job(job);
            //result.save(function (err) {
            //    if (err) return console.error(err);
            //    console.log("xong");
            //});
        }
    })
}

module.exports = router;