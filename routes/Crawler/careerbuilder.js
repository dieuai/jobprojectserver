/**
 * Created by DieuAi on 12/11/2015.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var urls = [];
var Job = require('../../models/Jobs');
var sp = require('scrapejs').init({
    cc: 1, // up to 2 concurrent requests
    delay: 1000 // delay 5 seconds before each request
});

var Xray = require('x-ray');
var x = Xray();

//http://careerbuilder.vn/vi/tim-viec-lam/nhan-vien-thiet-ke-web-web-designer-new.35A94BF4.html
//    http://careerbuilder.vn/vi/tim-viec-lam/nganh-nghe/cntt-phan-cung-mang,cntt-phan-mem/limit/50/page/2

//getLinks('http://careerbuilder.vn/vi/tim-viec-lam/embedded-software-engineer.35A947AC.html')
//function getLinks(url) {
//    x(url, {
//        job: '	#uni_container > section > div.MyJobDetail > div.MyJobLeft > div.bradius.LeftJobCB > h1	',
//        author: '	#uni_container > section > div.MyJobDetail > div.MyJobLeft > div.bradius.LeftJobCB > div.tit_company',
//        description1: x('div.bradius.LeftJobCB > div:nth-child(6) > div > ul', ['li']),
//        description2: x('div.bradius.LeftJobCB > div:nth-child(6) > div ', ['p']),
//        requirement1: x('  div:nth-child(7) > div', ['p']),
//        requirement2: x(' div:nth-child(7) > div > ul', ['li']),
//        benefit: x('div.bradius.LeftJobCB > div:nth-child(8) > div > ul', ['li']),
//        position: '	#showScroll > ul > li:nth-child(1) > p.fl_right > label	',
//        salary: '	#showScroll > ul > li.bgLine2 > p.fl_right	',
//        location: '	#showScroll > ul > li:nth-child(1) > p.fl_left > b > a	',
//        degree: '	#uni_container > section > div.MyJobDetail > div.MyJobLeft > div.bradius.LeftJobCB > div:nth-child(8) > div > ul > li:nth-child(1)	',
//        full_part: '	#uni_container > section > div.MyJobDetail > div.MyJobLeft > div.bradius.LeftJobCB > div:nth-child(8) > div > ul > li:nth-child(3)	',
//        exp: '	#showScroll > ul > li.bgLine2 > p.fl_left	',
//        nguoilienhe: '	#uni_container > section > div.MyJobDetail > div.MyJobLeft > div.bradius.LeftJobCB > div.box1Detail > p > label:nth-child(3) > strong	',
//        diachilienhe: '	#uni_container > section > div.MyJobDetail > div.MyJobLeft > div.bradius.LeftJobCB > div.box1Detail > p > label:nth-child(2) > label	',
//        page: '#cb-header > div.logo_nav > div.logo > a@href',
//        link: 'head > link:nth-child(17)@href',
//        dead_line: '	#showScroll > ul > li:nth-child(3) > p.fl_right	'
//    })
//    (function (err, obj) {
//        console.log(obj);
//        for (var key in obj) {
//            //splitString(obj, key, 'Hết hạn nộp: ');
//            //splitString(obj, key, 'Kinh nghiệm: ');
//            //splitString(obj, key, 'Hình thức: ');
//            //splitString(obj, key, 'Bằng cấp:');
//            //splitString(obj, key, 'Lương:  ');
//            if (key == 'dead_line') {
//                //console.log(obj);
//                var initial = obj[key].split(/\//).reverse().join('/');
//                //obj[key] = new Date(initial);
//                var job = new Job({
//                    job: obj.job,
//                    author: obj.author,
//                    description: obj.description1.concat(obj.description2).join('\n '),
//                    requirement: obj.requirement1.concat(obj.requirement2).join('\n '),
//                    benefit: obj.benefit.join('\n'),
//                    position: obj.position,
//                    salary: obj['salary'].split('Lương:  '),
//                    location: obj.location,
//                    degree: obj['degree'].split('Bằng cấp:'),
//                    full_part: obj['full_part'].split('Hình thức: '),
//                    exp: obj['exp'].split('Kinh nghiệm: '),
//                    nguoilienhe: obj.nguoilienhe,
//                    diachilienhe: obj.diachilienhe,
//                    page: obj.page,
//                    link: obj.link,
//                    dead_line: new Date(initial)
//                });
//                console.log(job);
//                //job.save(function (err) {
//                //    if (err) return console.error(err);
//                //    console.log("xong");
//                //});
//            }
//        }
//    });
//}
//function splitString(obj, key, string) {
//    if (obj[key].indexOf(string) != -1) {
//        var temp = obj[key].split(string);
//        obj[key] = temp[1];
//    }
//}

module.exports = router;