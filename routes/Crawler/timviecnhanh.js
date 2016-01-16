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

function getPage(k, report, next) {
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
                report['number_url'] = urls.length;
                for (var i = 0; i < urls.length; i++) {
                    getLinks(urls[i], report, next);
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

function getLinks(url, report, next) {
    var job = {
        page: 'timviecnhanh.com',
        link: '' + url
    };

    request({
        url: url,
        headers: {
            'Cookie': 'PHPSESSID=i1ipickraht1b45dpmracovrp6; JOB_WEEK_SECTION=2MR6rxonJmgS0DbiU6OWv2fPp4%2FZ2uTuQeLqBE6IZCh%2F4AhKCPGf1dbfEWYoIvKS3WQ0dLxkZP2bzTOwnoUFCQ%3D%3D; JOB_HOT_FOR_YOU_SECTION=8yWrmUJsjD4FRrRPGlO%2FVwQCy5iX4sPtYr7scZTGZlp2X6A5qo4r1BZrrsQGjlKek%2FQcA1s1euFBoQqwna7wzQ%3D%3D; JOB_FAST_SECTION=o21ZkHgz5N7weFGycgv8Iu%2BpYZekX8sMx%2BdI2YWJ7BOx0XIJxehcTTyxta1garpMtRlV0MAfFKQ17M22nE6kKw%3D%3D; _gat=1; USER_REMEMBER=xwSe%2BBi4Qlp4Cw5aisLd6p35J2P4RYt%2F1iYQPwZIg864pVK6pQKReMBw6GmAljx8BKzoUY3IsUIdiRdpO3Rlmn4UtHrZ%2F%2BK5dRaSOlQYDDCPOpVH1R8RuTkWDjybvQeD; USER=Oa5oePIuSQPj2lU%2BBHq9SZTo1zN%2F4iFcC24kV96mjr%2FYvbeAZLtElTGoLQqvJpgEOomNI%2F7XlYEk7KAMED%2BBg5v4t3PuMxctyP17mlkPtdq8gTLBFsP8CJHQh1FOLtpKdylsTZypGzMr9nTizDB%2Bd4NUffhSxlE6wLbUd4lcBh13D7fp0ZyL0TReXvL6bfJx1aHCVeIbQef9xVXTKhFbyIsg7j80FjK%2Bko8uzE%2Fvsd1Is5Qi1Y8gNU79mhbDKjXv6CpDNpRIelfJjuhzUGtGNx4P715gcDu76iFTDgwNM9YBtf7Iaze%2FCyZt71L%2FZGFGKwg5ksExUeFOeWBp0AvXBHNVeRTbfP52IXWDUpuBEwTa2Q7jibb95Usv%2Fu8rx%2Fcs; JOB_HOT_FIELD_SECTION_17=N1vbRIgwuqslVx7Pp0cnUxmf2clOhzg2CJFK%2BWT0SvI5puD54cj1Muh2i5OlJA0zAvyBm3Wzann%2F6FmgY%2FHqsQ%3D%3D; JOB_FOCUS_FIELD_SECTION_17=EhhC69%2FlEJtd3t%2BwuIiS6N9LwYsxIrFn0ioumyGcUCb8OlXXjJimHhPm6kdj8uJOOEFkZiiB%2Be8ucb7a7O%2BgWg%3D%3D; JOB_PAYMENT_SECTION=J3h8k2VkUXmDamnmDYkHW899yOacfSURSwNe4i80tJJxNaYZyW3OpxJBHh5ux7RC4bOzp%2FffnY5VaHcTNqtd3Q%3D%3D; SvID=w13|VppM/|VppMx; _ga=GA1.2.226415031.1450104707',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        },
        jar: j
    }, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.detail-content.box-content').each(function () {
                $(this).each(function () {
                    job['job'] = $(this).children().first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
                });
                $('.col-xs-6.p-r-10.offset10').each(function () {
                    job['author'] = $(this).children('h3').first().text().trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
                    job['diachilienhe'] = $(this).children('span').first().text().trim().replace('Địa chỉ: ', '').toString();
                });

                $('.col-xs-4.offset20.push-right-20').each(function () {
                    $(this).children().first().each(function () {
                        $(this).children().each(function () {
                            switch ($(this).children('b').text()) {
                                case '- Số lượng tuyển dụng:':
                                    job['number'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    }).get()[0]).replace('- Số lượng tuyển dụng:', '').trim().toString();
                                    break;
                                case '- Tính chất công việc:':
                                    job['full_part'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Tính chất công việc:', '').trim().toString();
                                    break;
                            }
                        })
                    });
                });

                $('.col-xs-4.offset20').each(function () {
                    $(this).children().first().each(function () {
                        $(this).children().each(function () {
                            switch ($(this).children('b').text()) {
                                case '- Trình độ:':
                                    job['degree'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    }).get()[0]).replace('- Trình độ:', '').trim().toString();
                                    break;
                                case '- Kinh nghiệm:':
                                    job['exp'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Kinh nghiệm:', '').trim().toString();
                                    break;
                                case '- Mức lương:':
                                    job['salary'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Mức lương:', '').trim().toString();
                                    break;
                                case '- Hình thức làm việc:':
                                    job['position'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Hình thức làm việc:', '').trim().toString();
                                    break;
                                case '- Tỉnh/Thành phố:':
                                    job['location'] = ($(this).map(function () {
                                        return $(this).text().trim();
                                    })
                                        .get()[0]).replace('- Tỉnh/Thành phố:', '').trim().replace('Việc làm ', '').replace('TP. HCM', 'Hồ Chí Minh').replace('Đắc Lắc', 'Đắk Lắk').replace('Bà Rịa-Vũng Tàu', 'Bà Rịa - Vũng Tàu').toString();
                                    break;
                            }
                        })
                    });
                });

                $('.width-13').each(function () {
                    switch ($(this).children().first().text()) {
                        case 'Mô tả':
                            job['description'] = $(this).parent().text().replace('Mô tả', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Yêu cầu':
                            job['requirement'] = $(this).parent().text().replace('Yêu cầu', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Quyền lợi':
                            job['benefit'] = $(this).parent().text().replace('Quyền lợi', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Hồ sơ':
                            job['cv'] = $(this).parent().text().replace('Hồ sơ', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                            break;
                        case 'Hạn nộp':
                            job['dead_line'] = new Date($(this).parent().text().replace('Hạn nộp', '').trim().split(/-/).reverse().join('/'));
                            break;
                    }
                });

                $('.width-25').each(function () {
                    switch ($(this).children().first().text()) {
                        case 'Người liên hệ':
                            job['nguoilienhe'] = $(this).parent().text().replace('Người liên hệ', '').trim().toString();
                            break;
                        case 'Email':
                            job['emaillienhe'] = $(this).parent().text().replace('Email', '').trim().toString();
                            break;
                        case 'Điện thoại':
                            job['dienthoailienhe'] = $(this).parent().text().replace('Điện thoại', '').trim().toString();
                            break;
                    }
                });

                $('.entry-date.published').each(function () {
                    job['date_update'] = new Date($(this).text().split(/-/).reverse().join('/'));
                })
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
    timviecnhanh: function (next) {
        console.log('3');
        var report = {
            page: 'timviecnhanh'
        };
        for (var k = 1; k < 100; k++) {
            getPage(k, report, next);
        }
    }
};
