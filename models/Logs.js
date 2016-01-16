var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    page: String,
    number_url: Number,
    number_job: Number,
    error_job: Number,
    date: Date
});

LogSchema.index(
    {
        "page" : 1,
        "date": -1
    },
    {
        name:'myJob'
    });

module.exports = mongoose.model("Log", LogSchema);
