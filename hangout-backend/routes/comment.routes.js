const router = require("express").Router();
const mongoose = require("mongoose");

const Hangout = require("../models/Hangout.model");
const Comment = require("../models/Comment.model");

// POST '/api/comments' route to create a new comment
router.post("/comments", async (req, res) => {
	const { content, rating, hangoutId } = req.body;

	try {
		// create a new comment
		let newComment = await Comment.create({
			content,
			rating,
			hangout: hangoutId,
		});

		// push new comment to hangout
		let response = await Hangout.findByIdAndUpdate(hangoutId, {
			$push: { comments: newComment._id },
		});

		res.json(response);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/hangouts/:hangoutId to get details of a specific hangout
router.get("/comments/:commentId", async (req, res) => {
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
router.put("/comments/:commentId", async (req, res) => {
	const { commentId } = req.params;
	const { content, rating } = req.body;

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		let updatedComment = await Comment.findByIdAndUpdate(
			commentId,
			{ content, rating },
			{ new: true }
		);
		res.json(updatedComment);
	} catch (error) {
		res.json(error);
	}
});

// DELETE '/api/comments/:commentId' route to delete comment
router.delete("/comments/:commentId", async (req, res) => {
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
