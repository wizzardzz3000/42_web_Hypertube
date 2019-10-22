const User = require("../schemas/User");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const request = require("request");
const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const OAuth2Strategy = require("passport-oauth2").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var userToken = jwtService.tokenGenerator();

const saveToSession = (req, res, error) => {
  const payload = {
    _id: req.user._id,
    username: req.user.username,
    language: req.user.language ? req.user.language : "en"
  };
  req.session.user = payload;

  req.session.save(err => {
    if (err) throw err;
    res.redirect("http://localhost:3000/activateOauth?token=" + userToken);
  });
};

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "784800871977-tfb75n389g6f7hpvug0hmfrdh1ku8ojn.apps.googleusercontent.com",
      clientSecret: "6rBvGJbcjXGOZku2VTkI8Bxv",
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async (token, tokenSecret, profile, done) => {
      User.findOne(
        {
          oauthID: profile.id
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          //var token = jwtService.tokenGenerator();
          if (!user) {
            if (!(await userService.emailExists(profile.emails[0].value))) {
              var uniqid =
                new Date().getTime() +
                Math.floor(Math.random() * 10000 + 1).toString(16);

              user = new User({
                username: await userService.usernameExists(
                  profile.displayName.replace(" ", "-")
                ),
                email: profile.emails[0]
                  ? profile.emails[0].value.toLowerCase()
                  : "",
                language: profile._json.locale,
                firstname: profile.name.givenName ? profile.name.givenName : "",
                lastname: profile.name.familyName
                  ? profile.name.familyName
                  : "",
                img: profile.photos[0] ? profile.photos[0].value : "",
                activationKey: uniqid,
                active: true,
                token: userToken,
                oauthID: profile.id,
                google: profile._json ? profile._json : {}
              });
              user.save(function(err) {
                if (err) return done(null, false, { error: err.message });
                return done(err, user);
              });
            } else {
              User.findOneAndUpdate(
                { email: profile.emails[0].value },
                {
                  token: userToken,
                  google: profile._json ? profile._json : "",
                  oauthID: profile.id
                },
                err => {
                  if (err) console.log(err);
                }
              );
              return done(err, user);
            }
          } else {
            User.findOneAndUpdate(
              { _id: user._id },
              { token: userToken },
              err => {
                if (err) console.log(err);
              }
            );
            return done(err, user);
          }
        }
      );
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login"
  }),
  function(req, res) {
    saveToSession(req, res);
  }
);

// TWITTER
passport.use(
  new TwitterStrategy(
    {
      consumerKey: "t2ncc93Na5XNNVtiOhjS3gvma",
      consumerSecret: "ZEs1taRDwz0dsKG9hxhtPI4BFw93rEwlkcJI4UpxZYPcD8Mgcm",
      callbackURL: "http://localhost:5000/auth/twitter/callback",
      includeEmail: true
    },
    async (token, tokenSecret, profile, done) => {
      User.findOne(
        {
          oauthID: profile.id
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            if (!(await userService.emailExists(profile._json.email))) {
              var uniqid =
                new Date().getTime() +
                Math.floor(Math.random() * 10000 + 1).toString(16);
              user = new User({
                username: await userService.usernameExists(
                  profile._json.screen_name
                ),
                email: "",
                firstname: profile._json.name
                  ? profile._json.name.split(" ")[0]
                  : "",
                lastname: profile._json.name
                  ? profile._json.name.split(" ")[1]
                  : "",
                img: profile.photos[0] ? profile.photos[0].value : "",
                activationKey: uniqid,
                token: userToken,
                active: true,
                oauthID: profile.id,
                twitter: profile._json ? profile._json : {}
              });
              user.save(function(err) {
                if (err) console.error(err);
                return done(err, user);
              });
            } else {
              User.findOneAndUpdate(
                { email: profile._json.email },
                {
                  token: userToken,
                  twitter: profile._json ? profile._json : "",
                  oauthID: profile.id
                },
                err => {
                  if (err) console.log(err);
                }
              );
              return done(err, user);
            }
          } else {
            User.findOneAndUpdate(
              { _id: user._id },
              { token: userToken },
              err => {
                if (err) console.log(err);
              }
            );
            return done(err, user);
          }
        }
      );
    }
  )
);

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "http://localhost:3000/login"
  }),
  (req, res) => {
    saveToSession(req, res);
  }
);

/* Github */
passport.use(
  new GitHubStrategy(
    {
      clientID: "Iv1.f91bdcfcdaa00d0c",
      clientSecret: "a34a7b9b40f5783c93967bf37b75f7c8e6535a2e",
      callbackURL: "http://localhost:5000/auth/github/callback",
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      User.findOne(
        {
          oauthID: profile.id
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          //var token = jwtService.tokenGenerator();
          if (!user) {
            if (!(await userService.emailExists(profile.emails[0].value))) {
              var uniqid =
                new Date().getTime() +
                Math.floor(Math.random() * 10000 + 1).toString(16);

              user = new User({
                username: await userService.usernameExists(profile._json.login),
                email: profile.emails[0]
                  ? profile.emails[0].value.toLowerCase()
                  : "",
                firstname: profile._json.name
                  ? profile._json.name.split(" ")[0]
                  : "",
                lastname: profile._json.name
                  ? profile._json.name.split(" ")[1]
                  : "",
                img: profile._json.avatar_url ? profile._json.avatar_url : "",
                activationKey: uniqid,
                active: true,
                token: userToken,
                oauthID: profile.id,
                github: profile._json ? profile._json : ""
              });
              user.save(function(err) {
                if (err) return done(null, false, { error: err.message });
                return done(err, user);
              });
            } else {
              User.findOneAndUpdate(
                { email: profile.emails[0].value },
                {
                  token: userToken,
                  github: profile._json ? profile._json : "",
                  oauthID: profile.id
                },
                err => {
                  if (err) console.log(err);
                }
              );
              return done(err, user);
            }
          } else {
            User.findOneAndUpdate(
              { _id: user._id },
              { token: userToken },
              err => {
                if (err) console.log(err);
              }
            );
            return done(err, user);
          }
        }
      );
    }
  )
);

router.get("/github", passport.authenticate("github", { scope: ["user"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/login"
  }),
  function(req, res) {
    saveToSession(req, res);
  }
);

/* 42 */
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://api.intra.42.fr/oauth/authorize",
      tokenURL: "https://api.intra.42.fr/oauth/token",
      clientID:
        "15e07f11520784e1d3f6e9397efef6afbd830e5ad62158d6ebefdc49d00de9d9",
      clientSecret:
        "aee3c426ee11d8ba5b45355615aafaa5c0f112131eccfa134c68a3d16c0e7cc6",
      callbackURL: "http://localhost:5000/auth/42/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      var options = {
        url: "https://api.intra.42.fr/v2/me",
        headers: {
          Authorization: "Bearer " + accessToken
        }
      };

      request(options, async (error, response, profile) => {
        if (!error && response.statusCode == 200) {
          profile = JSON.parse(profile);

          User.findOne(
            {
              oauthID: profile.id
            },
            async (err, user) => {
              if (err) {
                return done(err);
              }
              //var token = jwtService.tokenGenerator();
              if (!user) {
                if (!(await userService.emailExists(profile.email))) {
                  var uniqid =
                    new Date().getTime() +
                    Math.floor(Math.random() * 10000 + 1).toString(16);

                  user = new User({
                    username: await userService.usernameExists(profile.login),
                    email: profile.email ? profile.email.toLowerCase() : "",
                    firstname: profile.first_name ? profile.first_name : "",
                    lastname: profile.last_name ? profile.last_name : "",
                    img: profile.image_url ? profile.image_url : "",
                    activationKey: uniqid,
                    active: true,
                    token: userToken,
                    oauthID: profile.id,
                    42: profile ? profile : {}
                  });
                  user.save(function(err) {
                    if (err) return done(null, false, { error: err.message });
                    return done(err, user);
                  });
                } else {
                  User.findOneAndUpdate(
                    { email: profile.email },
                    {
                      token: userToken,
                      42: profile ? profile : "",
                      oauthID: profile.id
                    },
                    err => {
                      if (err) console.log(err);
                    }
                  );
                  return done(err, user);
                }
              } else {
                User.findOneAndUpdate(
                  { _id: user._id },
                  { token: userToken },
                  err => {
                    if (err) console.log(err);
                  }
                );
                return done(err, user);
              }
            }
          );
        }
      });
    }
  )
);

router.get("/42", passport.authenticate("oauth2"));

router.get(
  "/42/callback",
  passport.authenticate("oauth2", {
    failureRedirect: "http://localhost:3000/login?error=already"
  }),
  function(req, res, error) {
    saveToSession(req, res);
  }
);
module.exports = router;
