const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const usersSchema = mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    img: String,
    firstname: String,
    lastname: String,
    activationKey: String,
    active: { type: Boolean, default: 0 },
    language: { type: String, default: "en" },
    movies_seen: Array,
    following: Array,
    token: String,
    oauthID: String,
    google: JSON,
    twitter: JSON,
    github: JSON,
    42: JSON
});

usersSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", usersSchema);
module.exports = User;
