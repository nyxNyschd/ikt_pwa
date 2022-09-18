const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    url: String,
    image_id: String
});

module.exports = mongoose.model('Post', schema);