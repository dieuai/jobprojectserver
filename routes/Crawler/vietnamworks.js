var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var Job = require('../../models/Jobs');
var check = [];

//start();

function start() {
    var url = 'http://www.vietnamworks.com/it-hardware-networking-it-software-jobs-i55,35-en/page-';
    for (var u = 0; u < 100; u++) {
        viecLam(url, u);
    }
}

function viecLam(url, i) {
    request(url + i, function (err1, resp1, body) {
        if (!err1 && resp1.statusCode == 200) {
            var $ = cheerio.load(body);
            check.push('1');
            ////*[@id="job-list"]/div[1]/div/table/tbody/tr[50]/td/div/div[1]/div[2]
            $('.col-sm-9.col-sm-pull-3').each(function(){
                if (urls.indexOf($(this).children('div').first().children('a').attr('href')) == -1) {
                    urls.push($(this).children('div').first().children('a').attr('href'));
                }
            });
            if (check.length == 100) {
                console.log(urls.length);//889 - 883
                for (var i = 0; i < urls.length; i++) {
                    getLinks(urls[i]);
                }
            }
        }
    });
}

function getLinks(url) {
    var job = {
        page: 'vietnamworks.vn',
        link: '' + url,
        diachilienhe: url
    };

    request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.job-header-info').each(function(){
                job['job'] = $(this).children('h1').first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
            });

            $('.company-name.text-lg.block').each(function(){
                job['author'] = $(this).text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
            });

            $('.col-xs-12.col-md-8.col-lg-8.pull-left').each(function () {
                $('#job-detail').children('div').each(function () {
                    switch ($(this).children('h2').text().trim()) {
                        case 'What You Will Do':
                            job['description'] = $(this).children('div').text().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').trim().toString();
                            break;
                        case 'What You Are Good At':
                            job['requirement'] = $(this).children('div').text().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').trim().toString();
                            break;
                    }
                });
            });
            $('.pull-right.text-gray-light').children().last().each(function(){
                job['date_update'] = (new Date(new Date().setDate(new Date().getDate() - parseInt($(this).text().replace(/([A-Z]|[a-z])+/g, '-').trim()))));
            })
        }
        if (Object.keys(job).length > 3) {
            var result = new Job(job);
            result.save(function (err) {
                if (err) return console.error(err);
                console.log("xong");
            });
        }
    })
}

module.exports = router;