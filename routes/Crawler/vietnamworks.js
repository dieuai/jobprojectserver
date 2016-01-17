var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var Job = require('../../models/Jobs');
var Log = require('../../models/Logs');
var check = [];
var number_job = [];
var error_job = [];
var MAX = 100;

function viecLam(url, i, report, next) {
    request(url + i, function (err1, resp1, body) {
        if (!err1 && resp1.statusCode == 200) {
            var $ = cheerio.load(body);
            check.push('1');
            $('.col-sm-9.col-sm-pull-3').each(function () {
                if (urls.indexOf($(this).children('div').first().children('a').attr('href')) == -1) {
                    urls.push($(this).children('div').first().children('a').attr('href'));
                }
            });
            if (check.length == MAX) {
                console.log(urls.length);
                report['number_url'] = urls.length;
                for (var i = 0; i < urls.length; i++) {
                    getLinks(urls[i], report, urls, next);
                }
            }
        }
    });
}

function getLinks(url, report, urls, next) {
    var job = {
        page: 'vietnamworks.vn',
        link: '' + url,
        diachilienhe: url
    };

    request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.job-header-info').each(function () {
                job['job'] = $(this).children('h1').first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
            });

            $('.company-name.text-lg.block').each(function () {
                job['author'] = $(this).text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
            });

            $('.col-xs-12.col-md-8.col-lg-8.pull-left').each(function () {
                $('#job-detail').children('div').each(function () {
                    switch ($(this).children('h2').text().trim()) {
                        case 'What You Will Do':
                            job['description'] = $(this).children('div').text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').trim().replace(/<(?:.|\n)*?>/gm, '').trim().toString();
                            break;
                        case 'What You Are Good At':
                            job['requirement'] = $(this).children('div').text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').trim().replace(/<(?:.|\n)*?>/gm, '').trim().toString();
                            break;
                    }
                });
            });

            $('.pull-right.text-gray-light').children().last().each(function () {
                job['date_update'] = (new Date(new Date().setDate(new Date().getDate() - parseInt($(this).text().replace(/([A-Z]|[a-z])+/g, '-').trim()))));
            })
        }
        else {
            error_job.push('1');
        }
        if (Object.keys(job).length > 3) {
            number_job.push('1');
            var result = new Job(job);
            result.save(function (err) {
                if (err) return console.error(err);
            });
        }
        else {
            error_job.push('1');
        }
        console.log(number_job.length + error_job.length);
        if((number_job.length + error_job.length) == urls.length){
            report['number_job'] = number_job.length;
            report['error_job'] = error_job.length;
            report['date'] = new Date();
            if(Object.keys(report).length == 5){
                var log = new Log(report);
                log.save(function(err){
                    if(err) return console.error(err);
                    next();
                });
            }
        }
    });
}

module.exports = {
    vietnamworks: function (next) {
        console.log('Đang lấy dữ liệu trang vietnamworks');
        var report = {
            page: 'vietnamworks'
        };
        var url = 'http://www.vietnamworks.com/it-hardware-networking-it-software-jobs-i55,35-en/page-';
        for (var u = 0; u < MAX; u++) {
            viecLam(url, u, report, next);
        }
    }
};
