const router = require("express").Router();

const mongoose = require("mongoose");

// require data models
const Hangout = require("../models/Hangout.model");
const Comment = require("../models/Comment.model");

// POST /api/hangouts route that creates a new hangout
router.post("/hangouts", async (req, res) => {
	const { title, description, location, date, time, image, auth } = req.body;

	try {
		let response;

		response = await Hangout.create({
			title,
			description,
			location,
			date,
			time,
			image,
			auth,
			comments: []
		});

		res.json(response);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/hangouts route that lists all hangouts
router.get("/hangouts", async (req, res) => {
	try {
		let allHangouts = await Hangout.find().populate("comments");
		/* await allHangouts.populate("user"); */
		res.json(allHangouts);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/hangouts/:hangoutId to get details of a specific hangout
router.get("/hangouts/:hangoutId", async (req, res) => {
	const { hangoutId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(hangoutId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		let foundHangout = await Hangout.findById(hangoutId)
		.populate("comments");

		res.status(200).json(foundHangout);
	} catch (error) {
		res.json(error);
	}
});

// PUT /api/hangouts/:hangoutId to update details of a specific hangout
router.put("/hangouts/:hangoutId", async (req, res) => {
	const { hangoutId } = req.params;
	const { title, description, location, date, time, auth } = req.body;

	if (!mongoose.Types.ObjectId.isValid(hangoutId)) {
		res.status(400).json({ message: "specified id is not valid" }); 
		return;
	}

	try {
		let updatedHangout = await Hangout.findByIdAndUpdate(
			hangoutId,
			{ title, description, location, date, time, auth },
			{ new: true }
		);
		res.json(updatedHangout);
	} catch (error) {
		res.json(error);
	}
});

// DELETE /api/hangouts/:hangoutId to delete specific hangout
router.delete("/hangouts/:hangoutId", async (req, res) => {
	const { hangoutId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(hangoutId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		await Hangout.findByIdAndRemove(hangoutId);
		res.json({ message: `Hangout with id ${hangoutId} was removed` });
	} catch (error) {
		res.json(error);
	}
});

module.exports = router;
