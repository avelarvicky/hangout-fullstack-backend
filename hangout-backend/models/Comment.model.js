const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
	{
		content: String,
		rating: Number,
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
        hangout: {
            type: Schema.Types.ObjectId,
            ref: 'Hangout'
        }
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

module.exports = model("Comment", commentSchema);
