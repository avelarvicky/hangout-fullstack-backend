const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
	{
		content: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

module.exports = model("Comment", commentSchema);
