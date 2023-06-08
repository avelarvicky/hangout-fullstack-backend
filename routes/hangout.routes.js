const router = require("express").Router();

const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const authRoutes = require("../routes/auth.routes");

// require data models
const Hangout = require("../models/Hangout.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

// POST /api/hangouts route that creates a new hangout
router.post("/hangouts", isAuthenticated, async (req, res, next) => {
	const { user, title, description, location, date, time, image, auth } = req.body;

	const currentUser = req.payload._id;

	try {
		let newHangout = await Hangout.create({
			title,
			description,
			location,
			date,
			time,
			image,
			auth,
			comments: [],
		});

		await Hangout.findByIdAndUpdate(newHangout._id, {$push: {user: currentUser}})

		res.status(201).json(newHangout);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/hangouts route that lists all hangouts
router.get("/hangouts", async (req, res) => {
	try {
		let allHangouts = await Hangout.find().populate("comments");
		await allHangouts.populate("user");
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
		let foundHangout = await Hangout.findById(hangoutId).populate("comments");

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

// use the auth routes as middleware
/* router.use("/auth", authRoutes); */

// POST /api/:hangoutId/confirmations to add to confirmations
router.post("/:hangoutId/confirmations", async (req, res) => {
	const { hangoutId } = req.params;
	const { name } = req.body;

	if (!mongoose.Types.ObjectId.isValid(hangoutId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		const updatedHangout = await Hangout.findByIdAndUpdate(
			hangoutId,
			{ $push: { confirmations: name } },
			{ new: true }
		);

		res.json(updatedHangout);
	} catch (error) {
		res.json(error);
	}
});

// GET /api/confirmations/:hangoutId route to get confirmations of a specific hangout
router.get("/:hangoutId/confirmations", async (req, res) => {
	const { hangoutId } = req.params;

	try {
		let foundHangout = await Hangout.findById(hangoutId).populate(
			"confirmations"
		);
		res.json(foundHangout.confirmations);
	} catch (error) {
		res.json(error);
	}
});

// POST /api/confirmations/:hangoutId to remove from confirmations
router.post("/:hangoutId/confirmations", isAuthenticated, async (req, res) => {
	const { hangoutId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(hangoutId)) {
		res.status(400).json({ message: "specified id is not valid" });
		return;
	}

	try {
		const foundUserId = req.payload._id;
		let foundUser = await User.findById(foundUserId);

		if (!foundUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const updatedHangout = await Hangout.findByIdAndUpdate(
			hangoutId,
			{ $pull: { confirmations: foundUser._id } },
			{ new: true }
		);

		res.json(updatedHangout);
	} catch (error) {
		res.json(error);
	}
});

module.exports = router;
