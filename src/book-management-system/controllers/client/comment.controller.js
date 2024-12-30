const Comment = require('../../models/comment.models');

module.exports.addComment = async (req, res) => {
  try {
    const { name, email, message, saveInfo } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newComment = new Comment({
      name,
      email,
      message,
      saveInfo
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully!',
      data: newComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


module.exports.countComments = async (req, res) => {
    try {
      const count = await Comment.countDocuments();
      res.status(200).json({
        success: true,
        count
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to count comments. Please try again later.' });
    }
  };
  