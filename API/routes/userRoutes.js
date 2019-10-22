const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/userControllers');
const passport = require('passport');

exports.router = (() => {
  var userRouter = express.Router();

  userRouter.route('/register').post(userController.register);
  userRouter.route('/login').post(userController.login);
  userRouter.route('/activation').post(userController.activateAccount);
  userRouter.route('/forgot-password').post(userController.forgotPassword);
  userRouter.route('/change-password').post(userController.changePassword);
  userRouter.route('/reset-password').post(userController.resetPassword);
  userRouter.route('/logout').get(userController.logout);
  userRouter.route('/profile').get(userController.getProfile);
  userRouter.route('/get-profile/:username').get(userController.getUserByUsername);
  userRouter.route('/get-users-from-ids').post(userController.getUsersFromIdArray);
  userRouter.route('/follow').post(userController.followUser);
  userRouter.route('/unfollow').post(userController.unfollowUser);
  userRouter.route('/update').post(userController.updateUser);
  userRouter.route('/delete').delete(userController.deleteUser);
  userRouter.route('/session').get(userController.getSession);

  return userRouter;
})();
