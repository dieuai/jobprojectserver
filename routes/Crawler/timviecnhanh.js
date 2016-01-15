var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var Job = require('../../models/Jobs');
var check = [];
request = request.defaults({
    jar: true
});
var j = request.jar();
var sp = require('scrapejs').init({
    cc: 1, // up to 2 concurrent requests
    delay: 1000 // delay 5 seconds before each request
});

var Xray = require('x-ray');
var x = Xray();

//for (var k = 1; k < 100; k++) {
//    getPage(k);
//}

function getPage(k) {
    request('http://www.timviecnhanh.com/viec-lam-cong-nghe-thong-tin-c17.html?page=' + k, function (err1, resp1, body1) {
        if (!err1 && resp1.statusCode == 200) {
            var $ = cheerio.load(body1);
            check.push('1');
            $('a').each(function () {
                if ($(this).attr('href') != undefined) {
                    if ($(this).attr('href').indexOf('vieclam/congviec') > -1) {
                        //getLinks($(this).attr('href'));
                        var url = $(this).attr('href');
                        if (urls.indexOf(url) > -1) {
                        }
                        else {
                            urls.push(url);
                        }
                    }
                }
            });
            //console.log(check.length);
            if (check.length == 99) {
                console.log(urls.length);//993 - 962
                for (var i = 0; i < urls.length; i++) {
                    getLinks(urls[i]);
                }
            }
        }
    });
}
//
//function getLinks(url) {
//    x(url, {
//        job: '.block-title h1',
//        author: '.col-xs-6 h3',
//        description: 'tr td:nth-child(2)',
//        requirement: 'tr:nth-child(2) td:nth-child(2)',
//        benefit: 'tr:nth-child(3) td:nth-child(2)',
//        position: '.row div:nth-child(2) .no-style li:nth-child(4)',
//        salary: ".row div:nth-child(2) .no-style li:nth-child(3) ",
//        location: '.row div:nth-child(2) .no-style li:nth-child(5) a',
//        cv: 'tr:nth-child(4) td:nth-child(2)',
//        degree: ' div:nth-child(2) > ul > li:nth-child(1)',
//        number: '.row div:nth-child(1) .no-style li:nth-child(1)',
//        full_part: '.row div:nth-child(1) .no-style li:nth-child(3)',
//        exp: '.row div:nth-child(2) .no-style li:nth-child(2)',
//        nguoilienhe: '.block-info-company td p',
//        emaillienhe: '.block-info-company tr:nth-child(2) td p',
//        diachilienhe: '.block-info-company tr:nth-child(3) td p',
//        dienthoailienhe: '.block-info-company tr:nth-child(4) td p',
//        page: '.logo a@href',
//        link: 'head > link:nth-child(21)@href',
//        dead_line: 'tr:nth-child(5) > td:nth-child(2) > b'
//
//    })
//    (function (err, obj) {
//        for (var key in obj) {
//            console.log(key);
//            splitString(obj, key, '- Mức lương:');
//            splitString(obj, key, '- Trình độ:');
//            splitString(obj, key, '- Số lượng tuyển dụng:');
//            splitString(obj, key, '- Tính chất công việc:');
//            splitString(obj, key, '- Kinh nghiệm:');
//            splitString(obj, key, '- Hình thức làm việc:');
//            if (key == 'dead_line') {
//                var initial = obj[key].split(/-/).reverse().join('/');
//                obj[key] = new Date(initial);
//                var job = new Job(obj);
//                job.save(function (err) {
//                    if (err) return console.error(err);
//                    console.log("xong");
//                });
//            }
//        }
//    });
//}
//
//function splitString(obj, key, string) {
//    if (obj[key].indexOf(string) != -1) {
//        var temp = obj[key].split(string);
//        obj[key] = temp[1];
//    }
//}

function getLinks(url) {
    var job = {
        page: 'timviecnhanh.com',
        link: '' + url
    };

    request({
        url: url,
        headers: {
            'Cookie': 'PHPSESSID=c3j3vjk319lh3gfrped0bapb66; JOB_WEEK_SECTION=5gHR1y1Pm6uqld5SijRaLc0EFoWiJrxH6mgL0uHbjg8rrT%2Fn%2FtMV8SRpWDAsDAoXsNMU%2Bj0GZJK5%2Ff%2Bhyo1esA%3D%3D; JOB_PAYMENT_SECTION=tAczUx8ygEcEMapYhRV5MopE111200bvMCAy5zTJ3GEIAWKsIgo6cEVCd0Ugj4z%2BOsxQC6aCDh0x9QpCtRIo%2FA%3D%3D; JOB_HOT_FOR_YOU_SECTION=AExq7pZjukNDh8H7gpBQKQo6r9ava%2F5R9CsLBPnp0RF9%2FNs0JxnPPJ1p7rZTYW6cZORZy7y6bXz3tkvc1Kg46g%3D%3D; _gat=1; JOB_FAST_SECTION=1xC3ZjmCGESeY0AOSqrLVDTp5R5ZSRgyezxzj4zatXAK7%2Buszbode98wOS4crYbGxLnWyM7ltaSMy36vR4TCOg%3D%3D; USER_REMEMBER=iQHN0YaUGdlhO4upBLaXsSeLymcv6vxZCjnXbBr5eLZ6%2BNxSPwNjGbCzLfHfwGWqBdk%2BRBx%2BUCOxQw7pvdxnG4n5Mi7iD5PPZh%2Fi4qPvxY3BvcJ1hBQgtQstzqt5DOCu; SvID=w12|Vn+OS|Vn+ON; USER=SZnjf095SvDJ0Gsyq9eY6%2F3z2m04M5QJyTtPvrAJaslhaGuhI%2FnqfUCPHJIGFJSnguwri6bLe0ZVTLmFyGi62rABHN6Ogch3mnTXGN4zL83ZgsIrNBfc%2F%2Bc64pxszZSW3N8e6Xo%2BiKR54x9YfxgfagvhUydyH1CML7iFcZ0O3hZqyG5iZTefj%2BjT0AYPXp1Uf7fAUEayfAp%2BPHPSHx7bssyrJ0g8AYzfvwiX01YDiTQZn3VD0%2F1wKBLBaeTq%2BfpcYtbyfXco2vO8B8LvWLjxYYOJR736cjtd2tfFP3Lambl45%2FORby6dv6c2cW2g11t9Fn3Ndt9yRRZXly3ru9qQ%2FAMrf9pMlz4dsgaax8ySHggvcg50NQ56JhFe%2Fs8f5HzF; _ga=GA1.2.226415031.1450104707',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        },
        jar: j
    }, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.detail-content.box-content').each(function(){
                $(this).each(function(){
                    job['job'] = $(this).children().first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
                });
                $('.col-xs-6.p-r-10.offset10').each(function () {
                    job['author'] = $(this).children('h3').first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
                    job['diachilienhe'] = $(this).children('span').first().text().trim().replace('Địa chỉ: ','').toString();
                });

                $('.col-xs-4.offset20.push-right-20').each(function () {
                    $(this).children().first().each(function () {
                        $(this).children().each(function(){
                            switch ($(this).children('b').text()) {
                                case '- Số lượng tuyển dụng:':
                                    job['number'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    }).get()[0]).replace('- Số lượng tuyển dụng:','').trim().toString();
                                    break;
                                case '- Tính chất công việc:':
                                    job['full_part'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Tính chất công việc:','').trim().toString();
                                    break;
                            }
                        })
                    });
                });

                $('.col-xs-4.offset20').each(function(){
                    $(this).children().first().each(function () {
                        $(this).children().each(function(){
                            switch ($(this).children('b').text()) {
                                case '- Trình độ:':
                                    job['degree'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    }).get()[0]).replace('- Trình độ:','').trim().toString();
                                    break;
                                case '- Kinh nghiệm:':
                                    job['exp'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Kinh nghiệm:','').trim().toString();
                                    break;
                                case '- Mức lương:':
                                    job['salary'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Mức lương:','').trim().toString();
                                    break;
                                case '- Hình thức làm việc:':
                                    job['position'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Hình thức làm việc:','').trim().toString();
                                    break;
                                case '- Tỉnh/Thành phố:':
                                    job['location'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Tỉnh/Thành phố:','').trim().replace('Việc làm ','').replace('TP. HCM', 'Hồ Chí Minh').replace('Đắc Lắc', 'Đắk Lắk').replace('Bà Rịa-Vũng Tàu', 'Bà Rịa - Vũng Tàu').toString();
                                    break;
                            }
                        })
                    });
                });

                $('.width-13').each(function(){
                    switch ($(this).children().first().text()){
                        case 'Mô tả':
                            job['description'] = $(this).parent().text().replace('Mô tả','').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Yêu cầu':
                            job['requirement'] = $(this).parent().text().replace('Yêu cầu','').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Quyền lợi':
                            job['benefit'] = $(this).parent().text().replace('Quyền lợi','').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Hồ sơ':
                            job['cv'] = $(this).parent().text().replace('Hồ sơ','').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Hạn nộp':
                            job['dead_line'] = new Date($(this).parent().text().replace('Hạn nộp','').trim().split(/-/).reverse().join('/'));
                            break;
                    }
                });

                $('.width-25').each(function(){
                    switch ($(this).children().first().text()){
                        case 'Người liên hệ':
                            job['nguoilienhe'] = $(this).parent().text().replace('Người liên hệ','').trim().toString();
                            break;
                        case 'Email':
                            job['emaillienhe'] = $(this).parent().text().replace('Email','').trim().toString();
                            break;
                        case 'Điện thoại':
                            job['dienthoailienhe'] = $(this).parent().text().replace('Điện thoại','').trim().toString();
                            break;
                    }
                });

                $('.entry-date.published').each(function(){
                    job['date_update'] = new Date($(this).text().split(/-/).reverse().join('/'));
                })
            })

        }
        if (Object.keys(job).length > 2) {
            var result = new Job(job);
            result.save(function (err) {
                if (err) return console.error(err);
                console.log("xong");
            });
        }
    })
}

module.exports = router;