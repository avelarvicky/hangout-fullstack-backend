const { Schema, model } = require("mongoose");

const hangoutSchema = new Schema({
	title: {
		type: String,
		default: "New Hangout",
	},
	description: String ,
	location: String,
	date: {
		type: Number,
		default: Date.now,
	},
	time: {
		type: Number,
		default: new Date().getTime(),
	},
	auth: {
		type: String,
		enum: ["public", "private"],
		default: "public",
	},
	image: { type: String },
	confirmations: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

module.exports = model("Hangout", hangoutSchema);
