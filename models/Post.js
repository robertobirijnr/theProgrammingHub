const mongoose = require("mongoose");
const URLSlugs = require("mongoose-url-slugs");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories"
    },
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String
    },
    status: {
      type: String,
      default: "public"
    },
    allowComments: {
      type: Boolean,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    file: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments"
      }
    ]
  },
  { usePushEach: true }
);
PostSchema.plugin(URLSlugs("title", { field: "slug" }));
module.exports = mongoose.model("posts", PostSchema);
