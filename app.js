const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exhbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodoverride = require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const { mongoDbConnector } = require("./config/db");
const passport = require("passport");

mongoose
  .connect(mongoDbConnector, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const app = express();
const {
  select,
  generateTime,
  paginate
} = require("./middlewares/handlebars-helpers");

app.use(upload());

// view engine setup
app.engine(
  "handlebars",
  exhbs({
    defaultLayout: "home",
    helpers: { select: select, generateTime: generateTime, paginate: paginate }
  })
);
app.set("view engine", "handlebars");
app.use(logger("dev"));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "bobalaska123ilovecoding",
    resave: true,
    saveUninitialized: true
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//Local variables using middlwares
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.form_errors = req.flash("form-errors");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const categories = require("./routes/admin/categories");
const comments = require("./routes/admin/comments");

app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);
app.use("/admin/comments", comments);

module.exports = app;
