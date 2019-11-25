module.exports = {
  checkAuthentication: function(req, res, next) {
    if (req.isAuthenticated()) {
      //req.isAuthenticated() will return true if user is logged in
      next();
    } else {
      res.redirect("/login");
    }
  }
};
