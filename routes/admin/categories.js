const express = require("express");
const router = express.Router();
const Category = require("../../models/categories");
const { checkAuthentication } = require("../../middlewares/authentication");

router.all("/*", checkAuthentication, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Category.find({}).then(category => {
    res.render("admin/categories/index", { category });
    // res.status(200).redirect("admin/categories/index", { category });
  });
});

router.get("/edit/:id", (req, res) => {
  Category.findOne({ _id: req.params.id }).then(category => {
    res.render("admin/categories/edit", { category });
  });
});

router.post("/create", (req, res) => {
  const newCategory = new Category({
    name: req.body.name
  });

  newCategory.save().then(saveCategory => {
    console.log(saveCategory);
    res.redirect("/admin/categories");
  });
});

router.put("/edit/:id", (req, res) => {
  Category.findOne({ _id: req.params.id }).then(category => {
    category.name = req.body.name;
    category.save().then(saveCategory => {
      res.redirect("/admin/categories");
    });
  });
});

router.delete("/:id", (req, res) => {
  Category.deleteOne({ _id: req.params.id }).then(result => {
    res.redirect("/admin/categories");
  });
});

module.exports = router;
