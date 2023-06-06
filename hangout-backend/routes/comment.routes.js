const router = require("express").Router();
const mongoose = require("mongoose");

const Hangout = require("../models/Hangout.model");
const Comment = require("../models/Comment.model");

// POST '/api/comments' route to create a new comment
router.post("/:id/comments", async (req, res) => {
	const { content, hangoutId } = req.body;
	const { id } = req.params;
	// const user  = req.payload._id;
	try {
		// create a new comment
		let newComment = await Comment.create({
			content,
		});

		// push new comment to hangout
		let hangoutComment = await Hangout.findByIdAndUpdate(id, {
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
router.get("/:id/comments", async (req, res) => {
	const { id } = req.params;

	try {
		let hangout = await Hangout.findById(id);
		
		const hangoutPopulate = (populatedHangout) => {
			let arr = [];
			populatedHangout.comments.map( async (comment)=> {
				let kevin = await populatedHangout.populate(comment)
				arr.push(kevin)
			})
			console.log(arr)
		}

		hangout.populate();

		/* let arr = [];
		hangout.comments.map((comment)=> {
			arr.push(comment.populate())
		}) */

		console.log(hangout);
	} catch (error) {}
});

// GET /api/hangouts/:hangoutId to get details of a specific comment
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
