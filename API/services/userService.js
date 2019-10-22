const User = require("../schemas/User");
const sanitize = require("mongo-sanitize");
const accents = require("remove-accents");

module.exports = {
  usernameExists: async data => {
    data = accents.remove(data.toLowerCase());
    var result = await User.find({ username: data });
    if (result.length === 0) return data;
    else {
      data = data + 1;
      return data;
    }
  },

  emailExists: async data => {
    if (data) {
      var result = await User.find({ email: data });
      if (result.length === 0) return false;
      else return true;
    }
    return false;
  }
};
