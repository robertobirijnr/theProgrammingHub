const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/comment");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Comment.find({ user: req.user.id })
    .populate("user")
    .then(comments => {
      res.render("admin/comments", { comments });
    });
});

router.post("/", (req, res) => {
  Post.findOne({ _id: req.body.id }).then(post => {
    const newComment = new Comment({
      user: req.user.id,
      body: req.body.body
    });
    post.comments.push(newComment);
    post.save().then(savePost => {
      newComment.save().then(saveComment => {
        res.redirect(`/post/${post.id}`);
      });
    });
  });
});

router.delete("/:id", (req, res) => {
  Comment.deleteOne({ _id: req.params.id }).then(deleteItem => {

    Post.findOneAndUpdate({comments:req.params.id},{$pull:{comments:req.params.id}},(err,data)=>{
      if(err) console.log(err)
      res.redirect("/admin/comments");
    })
 
  });
});

module.exports = router;
