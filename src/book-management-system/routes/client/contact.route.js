const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/client/comment.controller');

router.post('/submit-comment', commentController.addComment);
router.get('/count-comment', commentController.countComments);
module.exports = router;