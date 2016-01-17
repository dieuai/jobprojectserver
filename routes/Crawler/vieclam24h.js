var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var check = [];
var Job = require('../../models/Jobs');
var Log = require('../../models/Logs');
request = request.defaults({
    jar: true
});
var j = request.jar();
var number_job = [];
var error_job = [];

function vieclam(url, report, next) {
    for (var k = 1; k < 80; k++) {
        getURL(url, k, report, next);
    }
}

function getURL(url, k, report, next) {
    request(url + k, function (err1, resp1, body1) {
        check.push('1');
        if (!err1 && resp1.statusCode == 200) {
            var $ = cheerio.load(body1);
            $('a').each(function () {
                if ($(this).attr('href') != undefined) {
                    if (($(this).attr('href').indexOf('it-phan-mem/') > -1) ||
                        ($(this).attr('href').indexOf('thuong-mai-dien-tu/') > -1) ||
                        ($(this).attr('href').indexOf('it-phan-cung-mang/') > -1)) {
                        var url = $(this).attr('href');
                        if (urls.indexOf(url) > -1) {
                        }
                        else {
                            urls.push(url);
                        }
                    }
                }
            });
            if (urls.length != 0 && check.length == 235) {
                console.log(urls.length);//1384 - 347
                report['number_url'] = urls.length;
                for (var i = 0; i < urls.length; i++) {
                    getLinks(urls[i], report, next);
                }
            }
        }
    });
};

//function getLinks(url) {
//    request.post({
//        headers: {'cookie': 'ad_rmu=1446216494301; PHPSESSID=stpfq5fulgv6ld56mlh40he0b4; _gat=1; _gat_24h=1; _gat_ntv=1; _gat_vl=1; _ga=GA1.3.1854451815.1445435864; gate=vlcm; _gali=btnLoginLeft; uid=3163898; SvID=w61|VkNXc|VkMzL'},
//        url: url,
//        body: "username=vtda@gmail.com&password=123456&submit=Login"
//    }, function (error, response, body) {
//        console.log(url);
//        console.log(body);
//        //x(body, {
//        //    job: 'h1'
//        //    //author: 'div:nth-child(1) > div > p > a',
//        //    //description: '#ttd_detail > div:nth-child(1) > div.pl_24.pr_24 > div:nth-child(1) > p',
//        //    //requirement: '#ttd_detail > div:nth-child(1) > div.pl_24.pr_24 > div:nth-child(3) > p',
//        //    //benefit: '#ttd_detail > div:nth-child(1) > div.pl_24.pr_24 > div:nth-child(2) > p',
//        //    //position: '#cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div.row.job_detail.text_grey2.fw500.mt_6.mb_4 > div:nth-child(2) > p:nth-child(2) > span > span',
//        //    //salary: "#cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div.row.job_detail.text_grey2.fw500.mt_6.mb_4 > div:nth-child(1) > p:nth-child(1) > span > span ",
//        //    //location: '#cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div.row.job_detail.text_grey2.fw500.mt_6.mb_4 > div:nth-child(2) > p:nth-child(1) > span > a',
//        //    //cv: '#ttd_detail > div:nth-child(1) > div.pl_24.pr_24 > div:nth-child(4) > p',
//        //    //degree: ' #cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div.row.job_detail.text_grey2.fw500.mt_6.mb_4 > div:nth-child(1) > p:nth-child(3) > span > span',
//        //    //number: '.row div:nth-child(1) .no-style li:nth-child(1)',
//        //    //full_part: '#cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div.row.job_detail.text_grey2.fw500.mt_6.mb_4 > div:nth-child(2) > p:nth-child(3) > span > span',
//        //    //exp: '#cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div.row.job_detail.text_grey2.fw500.mt_6.mb_4 > div:nth-child(1) > p:nth-child(2) > span > span',
//        //    //nguoilienhe: '#ttd_detail > div.job_description.bg_white.pl_24.pr_24.mt_16.pb_18.box_shadow > div:nth-child(2) > p',
//        //    //emaillienhe: '#ttd_detail > div.job_description.bg_white.pl_24.pr_24.mt_16.pb_18.box_shadow > div:nth-child(4) > div.col-md-9.pr_0 > p',
//        //    //diachilienhe: '#ttd_detail > div.job_description.bg_white.pl_24.pr_24.mt_16.pb_18.box_shadow > div:nth-child(3) > p',
//        //    //dienthoailienhe: '#ttd_detail > div.job_description.bg_white.pl_24.pr_24.mt_16.pb_18.box_shadow > div:nth-child(5) > p',
//        //    //page: '#block_header > div.header.pos_relative.w_100.h56.bg_blue > div.pos_relative.w_100.h56.bg_blue.box_header > div.col_head1.pos_relative.floatLeft > div > a > img@title',
//        //    //link: 'head > link:nth-child(9)@href',
//        //    //dead_line: '#cols-right > div.content_cols-right.pt_16.pl_24.pb_24 > div.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow > div:nth-child(2) > div.pull-left.w480.ml_14.mt_6.mb_6 > span > span > span > span'
//        //})
//        //(function (err, obj) {
//        //    console.log(obj);
//        //    //for (var key in obj) {
//        //    //    if (key == 'dead_line') {
//        //    //        var initial = obj[key].split(/\//).reverse().join('/');
//        //    //        obj[key] = new Date(initial);
//        //    //        var job = new Job(obj);
//        //    //        console.log(job);
//        //    //        //job.save(function (err) {
//        //    //        //    if (err) return console.error(err);
//        //    //        //    console.log("xong");
//        //    //        //});
//        //    //    }
//        //    //}
//        //});
//    });
//
//};

function getLinks(url, report, next) {

    var job = {
        page: 'vieclam24h.vn',
        link: '' + url
    };

    request({
        url: url,
        headers: {
            'Cookie': 'PHPSESSID=6ms99rk6qo0e5998rrk1ecld95; _gat=1; _gat_24h=1; _gat_ntv=1; _gat_vl=1; uid=3163898; SvID=w100|VppMH|VppMC; _ga=GA1.2.1629896616.1450099087; gate=vlcm',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        },
        jar: j
    }, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);

            $('.content_cols-right.pt_16.pl_24.pb_24').each(function () {
                job['job'] = $('.text_blue.font28.mb_10.mt_20.fws.title_big').text().toString();

                $('.box_chi_tiet_cong_viec.bg_white.mt16.box_shadow').each(function () {
                    $(this).children().first().each(function () {
                        $(this).children('div').each(function () {
                            job['author'] = $(this).children('p').text().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').toString();
                        })
                    })
                });

                $('.text_grey2.font12.mt8.mb12').each(function () {
                    job['date_update'] = new Date($(this).children('span').last().text().replace('Ngày làm mới: ', '').split(/\//).reverse().join('/'));
                });

                $('.row.job_detail.text_grey2.fw500.mt_6.mb_4').each(function () {

                    $(this).children().first().children('p').each(function () {
                        switch ($(this).children('span').first().contents().filter(function () {
                            return this.type === 'text';
                        }).text().trim()) {
                            case 'Mức lương:':
                                $(this).children('span').each(function () {
                                    job['salary'] = $(this).children('span').first().text().toString();
                                });
                                break;
                            case 'Kinh nghiệm:':
                                $(this).children('span').each(function () {
                                    job['exp'] = $(this).children('span').first().text().toString();
                                });
                                break;
                            case 'Yêu cầu bằng cấp:':
                                $(this).children('span').each(function () {
                                    job['degree'] = $(this).children('span').first().text().toString();
                                });
                                break;
                            case 'Số lượng cần tuyển:':
                                $(this).children('span').each(function () {
                                    job['number'] = $(this).children('span').first().text().toString();
                                });
                                break;
                        }
                    });

                    $(this).children().last().children('p').each(function () {
                        switch ($(this).children('span').first().contents().filter(function () {
                            return this.type === 'text';
                        }).text().trim()) {
                            case 'Địa điểm làm việc:':
                                $(this).children('span').each(function () {
                                    job['location'] = $(this).children('a').first().text().trim().replace('TP. HCM', 'Hồ Chí Minh').replace('Đắc Lắc', 'Đắk Lắk').replace('Bà Rịa-Vũng Tàu', 'Bà Rịa - Vũng Tàu').toString();
                                });
                                break;
                            case 'Chức vụ:':
                                $(this).children('span').each(function () {
                                    job['position'] = $(this).children('span').first().text().trim().toString();
                                });
                                break;
                            case 'Hình thức làm việc:':
                                $(this).children('span').each(function () {
                                    job['full_part'] = $(this).children('span').first().text().toString();
                                });
                                break;
                        }
                    });
                });
                $('.job_description.bg_white.mt_16.pb_18.box_shadow').each(function () {
                    $(this).children().last().each(function () {
                        $(this).children('div').each(function () {
                            switch ($(this).children('div').text().trim()) {
                                case 'Mô tả công việc':
                                    job['description'] = $(this).text().trim().replace('Mô tả công việc', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                                    break;
                                case 'Quyền lợi được hưởng':
                                    job['benefit'] = $(this).text().trim().replace('Quyền lợi được hưởng', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                                    break;
                                case 'Yêu cầu khác':
                                    job['requirement'] = $(this).text().trim().replace('Yêu cầu khác', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                                    break;
                                case 'Hồ sơ bao gồm':
                                    job['cv'] = $(this).text().trim().replace('Hồ sơ bao gồm', '').trim().replace(/(?:\\[rn]|[\r\n]+)+/g, '-').replace(/<(?:.|\n)*?>/gm, '').toString();
                                    break;
                            }
                        });
                    });
                });

                $('.pull-left.w480.ml_14.mt_6.mb_6').each(function () {
                    job['dead_line'] = new Date($(this).children('span').children('span').children('span').text().replace('Hạn nộp hồ sơ: ', '').split(/\//).reverse().join('/'));
                });

                $('.job_description.bg_white.pl_24.pr_24.mt_16.pb_18.box_shadow').children('div').each(function () {
                    switch ($(this).children('div').children('p').text()) {
                        case 'Người liên hệ':
                            job['nguoilienhe'] = $(this).children('p').first().text().trim().toString();
                            break;
                        case 'Địa chỉ liên hệ':
                            job['diachilienhe'] = $(this).children('p').first().text().trim().toString();
                            break;
                        case 'Email liên hệ':
                            job['emaillienhe'] = $(this).children('p').first().text().trim().toString();
                            break;
                        case 'Điện thoại liên hệ':
                            job['dienthoailienhe'] = $(this).children('p').first().text().trim().toString();
                            break;
                    }
                });
            });
        }
        else {
            error_job.push('1');
        }
        if (Object.keys(job).length > 10) {
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
    vieclam24h: function (next) {
        console.log('Đang lấy dữ liệu trang vieclam24h');
        var report = {
            page: 'vieclam24h'
        };
        var durl = ['https://vieclam24h.vn/tim-kiem-viec-lam-nhanh/?hdn_nganh_nghe_cap1=74&hdn_dia_diem=&hdn_tu_khoa=&hdn_hinh_thuc=&hdn_cap_bac=&page=', 'https://vieclam24h.vn/tim-kiem-viec-lam-nhanh/?hdn_nganh_nghe_cap1=74&hdn_dia_diem=&hdn_tu_khoa=&hdn_hinh_thuc=&hdn_cap_bac=&page=', 'https://vieclam24h.vn/tim-kiem-viec-lam-nhanh/?hdn_nganh_nghe_cap1=77&hdn_dia_diem=&hdn_tu_khoa=&hdn_hinh_thuc=&hdn_cap_bac=&page='];
        for (var i = 0; i < durl.length; i++) {
            vieclam(durl[i], report, next);
        }
    }
};
