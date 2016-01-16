var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var Job = require('../../models/Jobs');
var Log = require('../../models/Logs');
var check = [];
request = request.defaults({
    jar: true
});
var j = request.jar();
var number_job = [];
var error_job = [];


function templeRun(durl, report, next) {
    for (var i = 0; i < 100; i++) {
        viecLam(durl, i, report, next);
    }
}

function viecLam(durl, i, report, next) {
    request('' + durl + '' + i + '#list_job', function (err1, resp1, body) {
        if (!err1 && resp1.statusCode == 200) {
            var $ = cheerio.load(body);
            check.push('1');
            $('a').each(function () {
                if ($(this).attr('href') != undefined) {
                    if ($(this).attr('href').indexOf('tuyen-dung/viec-lam/') > -1) {
                        //getLinks($(this).attr('href'));
                        var url = 'http://mywork.com.vn' + $(this).attr('href');
                        if (urls.indexOf(url) > -1) {
                        }
                        else {
                            urls.push(url);
                        }
                    }
                }
            });
            if (check.length == 394) {
                console.log(urls.length);// 10795 - 1354
                report['number_url'] = urls.length;
                for (var i = 0; i < urls.length; i++) {
                    getLinks(urls[i], report, next);
                }
            }
        }
    });
}

function getLinks(url, report, next) {
    var job = {
        page: 'mywork.com.vn',
        link: '' + url
    };

    request({
        url: url,
        headers: {
            'Cookie': 'PHPSESSID=arv68upss2vhc8s7ak9at78ru7; lastvisit=1451148885; _gat=1; sessionhash=62a9aed12d47c6b43972f0ec532ee863; lastactivity=1452953032; __asc=3b0b70eb1524abf1891d738e920; __auc=3838ba79151a104c9c045750993; _ga=GA1.3.939673775.1450105425',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        },
        jar: j
    }, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.fullname-company').each(function () {
                job['author'] = $(this).text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
            });
            $('.address-company.mw-ti').each(function () {
                job['diachilienhe'] = $(this).text().toString();
            });
            $('.block_info.contentdef.list-desjob-company').each(function () {
                $('.desjob-company').each(function () {
                    switch ($(this).children().first().text()) {
                        case 'Mức lương':
                            job['salary'] = ($(this).map(function () {
                                return $(this).text().replace('Mức lương\n            Từ ', '').replace('00,000 đến ', ' - ').replace('00,000 VND', ' triệu').replace(',', '.').toString();
                            }).get()[0]).trim();
                            break;
                        case 'Kinh nghiệm':
                            job['exp'] = ($(this).map(function () {
                                return $(this).text().replace('Kinh nghiệm', '').trim().toString();
                            }).get()[0]).trim();
                            break;
                        case 'Trình độ học vấn':
                            job['degree'] = ($(this).map(function () {
                                return $(this).text().replace('Trình độ học vấn', '').trim().toString();
                            }).get()[0]).trim();
                            break;
                        case 'Mô tả công việc':
                            job['description'] = ($(this).children('p').map(function () {
                                return $(this).text();
                            }).get()[0]).replace('Mô tả công việc', '').replace(/(?:\\[rn]|[\r\n]+)+/g, '-').trim().replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Quyền lợi được hưởng':
                            job['benefit'] = ($(this).children('p').map(function () {
                                return $(this).text();
                            }).get()[0]).replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Yêu cầu công việc':
                            job['requirement'] = ($(this).children('p').map(function () {
                                return $(this).text();
                            }).get()[0]).replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Yêu cầu hồ sơ':
                            job['cv'] = ($(this).children('p').map(function () {
                                return $(this).text();
                            }).get()[0]).replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;

                        case 'Hạn nộp hồ sơ':
                            job['dead_line'] = new Date($(this).children('p').map(function () {
                                return $(this).text();
                            }).get()[0].replace(' (Đã hết hạn)', '').split(/-/).reverse().join('/'));
                    }
                });
                $('.leftlist-desjob-company').each(function () {
                    job['job'] = $(this).children().first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
                    $('.mw-ti').each(function () {
                        switch ($(this).children('span').first().text()) {
                            case 'Số lượng:':
                                job['number'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).trim().replace('Số lượng: ', '').toString();
                                break;
                            case 'Cấp bậc:':
                                job['position'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).trim().replace('Cấp bậc: ', '').toString();
                                break;
                            case 'Loại hình công việc:':
                                job['full_part'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).trim().replace('Loại hình công việc: ', '').toString();
                                break;
                        }
                    });
                    $('.desjob-company').each(function () {
                        switch ($(this).children().first().text()) {
                            case 'Nơi làm việc':
                                job['location'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).replace('Nơi làm việc\n', '').trim().replace('TP. HCM', 'Hồ Chí Minh').replace('Đắc Lắc', 'Đắk Lắk').replace('Bà Rịa-Vũng Tàu', 'Bà Rịa - Vũng Tàu').toString();
                                break;
                        }
                    });
                });
            });
            $('.ui.very.basic.collapsing.celled.table').each(function () {
                $(this).children().first().each(function () {
                    $(this).children('tr').each(function () {
                        switch ($(this).children().first().text().trim()) {
                            case 'Người liên hệ:':
                                job['nguoilienhe'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).replace('Người liên hệ:', '').trim().toString();
                                break;
                            case 'Email:':
                                job['emaillienhe'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).replace('Email:', '').trim().toString();
                                break;
                            case 'Điện thoại di động:':
                                job['dienthoailienhe'] = ($(this).map(function () {
                                    return $(this).text();
                                }).get()[0]).replace('Điện thoại di động:', '').trim().toString();
                                break;
                        }
                    });
                })
            });
            $('.action_job.score-job-company').children().first().each(function () {
                job['date_update'] = new Date($(this).children().last().map(function () {
                    return $(this).text();
                }).get()[0].trim().replace('Ngày cập nhật:', '').split(/-/).reverse().join('/'));
            })
        }
        else {
            error_job.push('1');
        }
        if (Object.keys(job).length > 2) {
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
    })
}

module.exports = {
    mywork: function (next) {
        console.log('4');
        var report = {
            page: 'mywork'
        };
        var durl = ["http://mywork.com.vn/tuyen-dung/37/it-phan-cung-mang.html/trang/", "http://mywork.com.vn/tuyen-dung/38/it-phan-mem.html/trang/", "http://mywork.com.vn/tuyen-dung/39/thiet-ke-do-hoa-web.html/trang/", "http://mywork.com.vn/tuyen-dung/40/thuong-mai-dien-tu.html/trang/"];
        for (var u = 0; u < durl.length; u++) {
            templeRun(durl[u], report, next);
        }
    }
};
