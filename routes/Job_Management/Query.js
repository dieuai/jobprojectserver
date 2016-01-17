var express = require('express');
var router = express.Router();
var Job = require('../../models/Jobs');
var support_function = require('../../support_function/support_function');
var fs = require('fs');

function checkDuplicateJob(authors, next) {
    Job.find({author: authors})
        .lean()
        .sort({job: 1})
        .exec(function (err, job) {
            if (job.length > 1) {
                for (var k = 0; k < job.length; k++) {
                    if (k < job.length - 1 && (job[k].job.toUpperCase().indexOf(job[k + 1].job.toUpperCase()) > -1)) {
                        if (job[k].location != undefined) {
                            if (k < job.length - 1 && (job[k].location.indexOf(job[k + 1].location) > -1)) {
                                if (k < job.length - 1 && support_function.equalDay(new Date(job[k].dead_line), new Date(job[k + 1].dead_line))) {
                                    if (k < job.length - 1 && (job[k].page.indexOf(job[k + 1].page) > -1)) {
                                        for (var f = 1; f < job.length; f++) {
                                            Job.find({_id: job[f]._id})
                                                .remove()
                                                .exec(function (err, data) {
                                                    if (err) console.log(err);
                                                    console.log('1');
                                                    next();
                                                })
                                        }
                                    }
                                    else if (k < job.length - 1 && (job[k].page.indexOf(job[k + 1].page) == -1)) {
                                        var job_temp = job.sort(compare);
                                        var page_temp = [];
                                        for (var l = 0; l < job_temp.length; l++) {
                                            if (l < job_temp.length - 1) {
                                                if (job_temp[l].page.indexOf(job_temp[l + 1].page) > -1) {
                                                    Job.find({_id: job_temp[l]._id})
                                                        .remove()
                                                        .exec(function (err, data) {
                                                            if (err) console.log(err);
                                                            next();
                                                        })
                                                }
                                                else if (job_temp[l].page.indexOf(job_temp[l + 1].page) == -1) {
                                                    for (var q = 0; q < job_temp.length; q++) {
                                                        if (page_temp.indexOf(job_temp[q].page) == -1) {
                                                            page_temp.push(job_temp[q].page);
                                                            if (q == job_temp.length - 1) {
                                                                console.log(page_temp.toString());
                                                                Job.findByIdAndUpdate(job_temp[0]._id, {$set: {page: page_temp}}, function (err, data) {
                                                                    if (err) return handleError(err);
                                                                    console.log(data);
                                                                });
                                                                for (var w = 1; w < job_temp.length; w++) {
                                                                    Job.find({_id: job_temp[w]._id})
                                                                        .remove()
                                                                        .exec(function (err, data) {
                                                                            if (err) console.log(err);
                                                                            console.log(data);
                                                                            next();
                                                                        })
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
}

function compare(a, b) {
    if (a.page < b.page)
        return -1;
    if (a.page > b.page)
        return 1;
    return 0;
}

module.exports = {
    checkDuplicate: function(next){
        Job.find()
        .lean()
        .distinct('author')
        .exec(function (err, author) {
            if (author.length > 0) {
                for (var j = 0; j < author.length; j++) {
                    if(author[j] != null || author[j] != ''){
                        checkDuplicateJob(author[j], next);
                    }
                }
            }
        })
    }
};
