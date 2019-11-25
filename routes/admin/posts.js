const express = require("express");
const router = express.Router();
const fs = require("fs");
const Post = require("../../models/Post");
const { isEmpty, uploadDir } = require("../../middlewares/upload-helper");
const Category = require("../../models/categories");
const { checkAuthentication } = require("../../middlewares/authentication");

router.all("/*", checkAuthentication, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .populate("category")
    .then(posts => {
      res.render("admin/posts", { posts: posts });
    });
});

router.get("/create", checkAuthentication, (req, res) => {
  Category.find({}).then(Categories => {
    res.render("admin/posts/create", { Categories });
  });
  // res.send('it works')
});

router.post("/create", (req, res) => {
  let filename = "";

  if (!isEmpty(req.files)) {
    let file = req.files.file;
    filename = Date.now() + "-" + file.name;

    file.mv("./public/images/" + filename, err => {
      if (err) throw err;
    });
  } else {
    console.log("is not empty");
  }

  let allowComments = true;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newPost = new Post({
    title: req.body.title,
    status: req.body.status,
    allowComments: allowComments,
    body: req.body.body,
    file: filename,
    category: req.body.category
  });

  newPost
    .save()
    .then(savePost => {
      req.flash(
        "success_message",
        `Post ${savePost.title} was created successfully`
      );
      res.redirect("/admin/posts");
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    Category.find({}).then(Categories => {
      res.render("admin/posts/edit", { post, Categories });
    });
  });
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;
      post.file = filename;

      file.mv("./public/images/" + filename, err => {
        if (err) throw err;
      });
    }

    post.save().then(updatedPost => {
      req.flash("success_message", "Post was successfully updated");
      res.redirect("/admin/posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    post.deleteOne();
    fs.unlink(uploadDir + post.file, err => {
      req.flash("success_message", "Post was successfully Deleted");
      res.redirect("/admin/posts");
    });
  });
});

module.exports = router;
