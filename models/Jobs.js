var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
    job: String,
    author: String,
    description: String,
    requirement: String,
    benefit: String,
    position: String,
    salary: String,
    location: String,
    cv: String,
    degree: String,
    number: Number,
    full_part: String,
    exp: String,
    nguoilienhe: String,
    emaillienhe: String,
    diachilienhe: String,
    dienthoailienhe: String,
    page: String,
    link: String,
    dead_line: Date,
    date_update: Date
});

JobSchema.index(
    {
        "author" : 1,
        "job" : 1,
        "location" : 1,
        "page": 1,
        "dead_line": 1,
        date_update: -1
    },
    {
        name:'myJob'
    });

JobSchema.index(
    {
        "link" : 1
    },
    {
        name:'link'
    },
    {
        unique: true
    });


module.exports = mongoose.model("Job", JobSchema);
