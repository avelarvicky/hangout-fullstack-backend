const { Schema, model } = require("mongoose");

const hangoutSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	title: {
		type: String,
		required: true,
		default: "New Hangout",
	},
	description: String,
	location: String,
	date: {
		type: Date,
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
		required: true,
	},
    image: String,
    confirmations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
