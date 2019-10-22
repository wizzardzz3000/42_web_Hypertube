var jwt = require("jsonwebtoken");

const PRIVATE_KEY =
  "a5f0f80f2a0012236be249d8351d5fd913ff7e666f70d5704940f0a02a39ab4989fd1cd69b3f5bcb04bc5eedc1a803c43bd87f90e9f3f3e3fb7cd0cbb0b912c5";

module.exports = {
  tokenGenerator: () => {
    //console.log(userData);
    var jwt_token = jwt.sign({}, PRIVATE_KEY, {
      expiresIn: "24h"
    });
    return jwt_token;
  },

  parseAuthorization: authorization => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },

  verifyToken: token => {
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, PRIVATE_KEY);
      } catch (err) {}
      //console.log(jwtToken);
      if (jwtToken != null) return true;
      else return false;
    }
  }
};
