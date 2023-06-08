const router = require("express").Router();
const mongoose = require("mongoose");

const Hangout = require("../models/Hangout.model");
const Comment = require("../models/Comment.model");

// POST '/api/comments' route to create a new comment
router.post("/:hangoutId/comments/:userId", async (req, res) => {
	const { content } = req.body;
	const { hangoutId, userId } = req.params;
	// const user  = req.payload._id;
	try {
		// create a new comment
		let newComment = await Comment.create({
			content,
			author: userId,
		});

		// push new comment to hangout
		let hangoutComment = await Hangout.findByIdAndUpdate(hangoutId, {
			$push: { comments: newComment._id },
		});

		/* let userComment = await Comment.findByIdAndUpdate(newComment._id, {
			$push: { author: user },
		}); */

		res.json(hangoutComment);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/comments route to get comments of a specific hangout
router.get("/:hangoutId/comments", async (req, res) => {
	const { hangoutId } = req.params;

	try {
		let foundHangout = await Hangout.findById(hangoutId).populate("comments");
		res.json(foundHangout.comments);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/hangouts/:hangoutId to get details of a specific comment
router.get("/:hangoutId/comments/:commentId", async (req, res) => {
	const { commentId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		let foundComment = await Comment.findById(commentId);
		res.status(200).json(foundComment);
	} catch (error) {
		res.json(error);
	}
});

// PUT '/api/comments/:commentId' route to edit comment
router.put("/:hangoutId/comments/:commentId", async (req, res) => {
	const { commentId } = req.params;
	const { content } = req.body;

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		let updatedComment = await Comment.findByIdAndUpdate(
			commentId,
			{ content },
			{ new: true }
		);
		res.json(updatedComment);
	} catch (error) {
		res.json(error);
	}
});

// DELETE '/api/comments/:commentId' route to delete comment
router.delete("/:hangoutId/comments/:commentId", async (req, res) => {
	const { commentId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		await Comment.findByIdAndRemove(commentId);
		res.json({ message: `Comment with ${commentId} is removed.` });
	} catch (error) {
		res.json(error);
	}
});

module.exports = router;
