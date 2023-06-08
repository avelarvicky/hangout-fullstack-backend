const { Schema, model } = require("mongoose");

const hangoutSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	title: {
		type: String,
		default: "New Hangout",
	},
	description: String,
	location: String,
	date: {
		type: String,
		default: "TBA",
	},
	time: {
		type: String,
		default: "00:00",
	},
	auth: {
		type: String,
		enum: ["public", "private"],
		default: "public",
	},
	image: { type: String },
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	confirmations: [
		{
			type: String,
		},
	],
});

module.exports = model("Hangout", hangoutSchema);
