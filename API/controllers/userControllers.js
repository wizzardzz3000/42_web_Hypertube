const User = require("../schemas/User");
const inputService = require("../services/inputServices");
const jwtService = require("../services/jwtService");
const mailService = require("../services/mailService");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const sanitize = require("mongo-sanitize");

const mailPattern = /^([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)\.([a-zA-Z]{2,})+$/;

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

module.exports = {
  login: async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.json({ status: "error", msg: "login_failed" });
      }
      if (!user) {
        return res.json({ status: "error", msg: "invalid_cred" });
      }
      req.logIn(user, err => {
        if (err) {
          console.error(err);
          return res.json({ status: "error", msg: "login_failed" });
        }

        if (user.active === true) {
          var token = jwtService.tokenGenerator();
          User.findOneAndUpdate({ _id: user._id }, { token: token }, err => {
            if (err)
              return res.json({
                status: "error",
                msg: "login_failed"
              });
          });

          const payload = {
            _id: user._id,
            username: user.username,
            language: user.language,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            picture: user.img,
            movies_seen: user.movies_seen,
            following: user.following
          };
          req.session.user = payload;

          req.session.save(err => {
            if (err) throw err;
            return res.json({ status: "success", user: payload, token: token });
          });
        } else {
          return res.json({
            status: "error",
            msg: "login_inactive"
          });
        }
      });
    })(req, res, next);
  },

  register: async (req, res, next) => {
    //Check inputs
    var lang = req.session.language;
    console.log(lang);
    var err;
    if ((err = inputService.lastname(req.body.lastname).error))
      return res.status(400).json({ error: err });
    if ((err = inputService.firstname(req.body.firstname).error))
      return res.status(400).json({ error: err });
    if ((err = inputService.password(req.body.pwd1).error))
      return res.status(400).json({ error: err });
    if ((err = inputService.password(req.body.pwd2).error))
      return res.status(400).json({ error: err });
    if (req.body.pwd1 !== req.body.pwd2)
      return res.status(400).json({ error: "unequal_passwords" });

    err = await inputService.username(req.body.username);
    if (err.error) return res.status(400).json({ error: err.error });
    err = await inputService.mail(req.body.email);
    if (err.error) return res.status(400).json({ error: err.error });

    var uniqid =
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1).toString(16);

    var user = new User({
      username: sanitize(req.body.username.toLowerCase()),
      firstname: sanitize(req.body.firstname.toLowerCase()),
      lastname: sanitize(req.body.lastname.toLowerCase()),
      email: sanitize(req.body.email.toLowerCase()),
      img: sanitize(req.body.picture),
      language: sanitize(req.body.language.toLowerCase()),
      activationKey: uniqid
    });

    User.register(user, req.body.pwd1, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      mailService.sendActivation(user);
      return res.status(200).json({ status: "success" });
    });
  },

  updateUser: async (req, res, next) => {
    var token = jwtService.parseAuthorization(req.headers.authorization);
    if (jwtService.verifyToken(token)) {
      var err;
      if (
        req.body.firstname !== undefined &&
        (err = inputService.firstname(req.body.firstname).error)
      ) {
        return res.status(400).json({ error: err });
      }
      if (
        req.body.lastname !== undefined &&
        (err = inputService.lastname(req.body.lastname).error)
      ) {
        return res.status(400).json({ error: err });
      }
      if (req.body.username !== undefined) {
        err = await inputService.username(req.body.username);
        if (err.error) {
          return res.status(400).json({ error: err.error });
        }
      }
      if (req.body.email !== undefined) {
        err = await inputService.mail(req.body.email);
        if (err.error) {
          return res.status(400).json({ error: err.error });
        }
      }
      User.findOneAndUpdate({ token: token }, sanitize(req.body), err => {
        if (err) return res.status(400).json({ error: "update_failed" });
      });
      return res.status(200).json({ message: "update_success" });
    }
    return res.status(400).json({ error: "update_failed" });
  },

  getUserByUsername: async (req, res, next) => {
    await User.findOne({ username: req.params.username }, function(err, user) {
      if (err) {
        return res.status(401).json({ error: "User not found" });
      }
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    });
  },

  logout: async (req, res, next) => {
    var token = jwtService.parseAuthorization(req.headers.authorization);
    if (jwtService.verifyToken(token)) {
      User.findOneAndUpdate({ token: token }, { token: null }, err => {
        if (err) console.log(err);
      });
      req.logout();
      req.session = null;
      return res.status(200).json({ message: "Logged out!" });
    }
  },

  getProfile: async (req, res, next) => {
    console.log(req.headers.authorization);
    if (!req.session.user)
      return res.status(401).json({ error: "You are not logged in!" });
    return res.status(200).json({ message: "success" });
  },

  getSession: async (req, res, next) => {
    var token = req.headers.authorization;
    token = jwtService.parseAuthorization(token);
    await User.findOne({ token: token }, (err, user) => {
      if (user) {
        if (jwtService.verifyToken(token)) {
          if (typeof req.session.user !== "undefined") {
            User.findOne({ _id: req.session.user._id }, (err, user) => {
              if (user) req.session.user.language = user.language;
              return res.status(200).json(user);
            });
          } else return res.status(401).json({ error: "No session for user" });
        } else return res.status(401).json({ error: "Invalid token" });
      }
    });
  },

  activateAccount: async (req, res, next) => {
    await User.findOne(
      { username: sanitize(req.body.username) },
      (err, response) => {
        if (response && response.active)
          return res.status(200).json({ message: "already_active" });
        if (err) return res.json({ status: "error" });
        if (response === null || response.activationKey !== req.body.key)
          return res.status(400).json({ status: false });
        User.findOneAndUpdate(
          {
            username: sanitize(req.body.username),
            activationKey: sanitize(req.body.key)
          },
          { active: true, activationKey: null },
          err => {
            if (err) {
              console.log(err);
              return res.status(400).json({ status: false });
            }
          }
        );
        return res.status(200).json({ status: true });
      }
    );
  },

  forgotPassword: async (req, res, next) => {
    var data = req.body.login;
    var mailPattern = /^([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)\.([a-zA-Z]{2,})+$/;

    if (!mailPattern.test(data)) {
      var result = await User.find({ username: sanitize(data) });
      if (result.length < 1)
        return res.status(400).json({ error: "invalid_username" });
      else {
        var uniqid =
          new Date().getTime() +
          Math.floor(Math.random() * 10000 + 1).toString(16);
        await User.findOneAndUpdate(
          { username: sanitize(data) },
          {
            activationKey: uniqid
          },
          (err, user) => {
            if (err) console.log(err);
            //mailService.sendNewPassword(user);
          }
        );
        var statusMail = mailService.sendNewPassword(result[0], uniqid);
        if (statusMail === "error")
          return res.status(400).json({ error: "invalid_unknown_email" });
        return res.status(200).json({ message: "receive_email" });
      }
    } else {
      var result = await User.find({ email: sanitize(data) });
      if (result.length < 1)
        return res.status(400).json({ error: "invalid_email" });
      else {
        var uniqid =
          new Date().getTime() +
          Math.floor(Math.random() * 10000 + 1).toString(16);
        await User.findOneAndUpdate(
          { email: sanitize(data) },
          {
            activationKey: uniqid
          },
          (err, user) => {
            if (err) console.log(err);
          }
        );
        mailService.sendNewPassword(result[0], uniqid);
        return res.status(200).json({ message: "receive_email" });
      }
    }
  },

  resetPassword: async (req, res, next) => {
    var err;
    if ((err = inputService.password(req.body.pwd1).error))
      return res.status(400).json({ error: err });
    if ((err = inputService.password(req.body.pwd2).error))
      return res.status(400).json({ error: err });
    if (req.body.pwd1 !== req.body.pwd2)
      return res.status(400).json({ error: "unequal_passwords" });

    var result = await User.find({
      username: sanitize(req.body.username),
      activationKey: sanitize(req.body.key)
    });
    if (result.length < 1)
      return res.status(400).json({ error: "reset_password_failed" });
    else {
      User.findOneAndUpdate(
        { username: sanitize(req.body.username) },
        {
          activationKey: null
        },
        (err, user) => {
          if (err) console.log(err);
          user.setPassword(req.body.pwd1, () => {
            user.save().catch(err => {
              console.error(err);
            });
            return res.status(200).json({ status: "success" });
          });
        }
      );
    }
  },

  changePassword: async (req, res, next) => {
    var err;
    if ((err = inputService.password(req.body.pwd1).error))
      return res.status(400).json({ error: err });
    if ((err = inputService.password(req.body.pwd2).error))
      return res.status(400).json({ error: err });
    if (req.body.pwd1 !== req.body.pwd2)
      return res.status(400).json({ error: "unequal_passwords" });

    var result = await User.find({
      username: sanitize(req.body.username)
    });
    if (result.length < 1)
      return res.status(400).json({ error: "reset_password_failed" });
    else {
      User.findOneAndUpdate(
        { username: sanitize(req.body.username) },
        {
          activationKey: null
        },
        (err, user) => {
          if (err) console.log(err);
          user.setPassword(req.body.pwd1, () => {
            user.save().catch(err => {
              console.error(err);
            });
            return res.status(200).json({ status: "success" });
          });
        }
      );
    }
  },

  deleteUser: async (req, res, next) => {
    var token = jwtService.parseAuthorization(req.headers.authorization);
    if (jwtService.verifyToken(token)) {
      await User.findOne({ token: token }, function(err, user) {
        if (err) {
          return res
            .status(400)
            .json({ error: "Impossible to delete account..." });
        }
        if (!user) {
          return res
            .status(400)
            .json({ error: "Impossible to delete account..." });
        } else {
          User.findOneAndRemove({ token: token }, err => {
            if (err) {
              return res
                .status(400)
                .json({ error: "Impossible to delete account..." });
            } else {
              return res.status(200).json({ status: "success" });
            }
          });
        }
      });
    } else {
      return res.status(400).json({ error: "Impossible to delete account..." });
    }
  },

  followUser: async (req, res, next) => {
    var token = jwtService.parseAuthorization(req.headers.authorization);
    if (jwtService.verifyToken(token)) {
      await User.findOne({ token: token }, async function(err, user) {
        if (err) {
          return res.status(400).json({ error: "follow_fail" });
        }
        if (!user) {
          return res.status(400).json({ error: "follow_fail" });
        } else {
          await User.findOne({ username: req.body.username }, async function(
            err,
            result
          ) {
            if (err) {
              return res.status(400).json({ error: "follow_fail" });
            }
            if (!result) {
              return res.status(400).json({ error: "follow_fail" });
            }
            if (user._id === result._id) {
              return res.status(400).json({ error: "follow_fail" });
            } else {
              await User.find(
                { _id: user._id, following: { $in: result._id } },
                function(err, check) {
                  if (err) {
                    return res.status(400).json({ error: "follow_fail" });
                  }
                  if (check.length) {
                    return res.status(400).json({ error: "follow_already" });
                  } else {
                    user.following.push(result._id);
                    user.save();
                    return res.status(200).json({
                      message: "following_user",
                      userFollowed: result,
                      followingList: user.following
                    });
                  }
                }
              );
            }
          });
        }
      });
    }
  },

  unfollowUser: async (req, res, next) => {
    var token = jwtService.parseAuthorization(req.headers.authorization);
    if (jwtService.verifyToken(token)) {
      await User.findOne({ token: token }, async function(err, user) {
        if (err) {
          return res.status(400).json({ error: "unfollow_fail" });
        }
        if (!user) {
          return res.status(400).json({ error: "unfollow_fail" });
        } else {
          await User.findOne({ username: req.body.username }, async function(
            err,
            result
          ) {
            if (err) {
              return res.status(400).json({ error: "unfollow_fail" });
            }
            if (!result) {
              return res.status(400).json({ error: "unfollow_fail" });
            }
            if (user._id === result._id) {
              return res.status(400).json({ error: "unfollow_fail" });
            } else {
              await User.find(
                { _id: user._id, following: { $in: result._id } },
                function(err, check) {
                  if (err) {
                    return res.status(400).json({ error: "unfollow_fail" });
                  }
                  if (!check.length) {
                    return res.status(400).json({ error: "unfollow_already" });
                  } else {
                    user.following.remove(result._id);
                    user.save();
                    return res.status(200).json({
                      message: "unfollowing_user",
                      userFollowed: result,
                      followingList: user.following
                    });
                  }
                }
              );
            }
          });
        }
      });
    }
  },

  getUsersFromIdArray: async (req, res, next) => {
    await User.find({ _id: { $in: req.body.IdArray } }, async function(
      err,
      users
    ) {
      if (err) {
        return res
          .status(400)
          .json({ error: "Impossible to retrieve users..." });
      }
      if (!users) {
        return res
          .status(400)
          .json({ error: "Impossible to retrieve users..." });
      } else {
        return res.status(200).json({ usersList: users });
      }
    });
  }
};
