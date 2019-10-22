const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    userId: String,
    username: String,
    firstname: String,
    movieImdbId: String,
    content: String,
    timestamp: Date,
});

module.exports = Comment = mongoose.model("Comment", CommentSchema);