const express = require('express');
const commentController = require('../controllers/commentController');

exports.router = (() => {
    var commentRouter = express.Router();
  
    commentRouter.route("/loadComments").post(async (req, res) => commentController.loadComments(req, res));
    commentRouter.route("/addComment").post(async (req, res) => commentController.addComment(req, res));
    commentRouter.route("/deleteComment").post(async (req, res) => commentController.deleteComment(req, res));
  
    return commentRouter;
  })();