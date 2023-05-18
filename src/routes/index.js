const express = require("express");
const router = express.Router();
let Person = require("../models/person");
let Producto = require("../models/producto");
let Provedor = require("../models/provedor");

const passport = require("passport");
/**/
router.get("/", (req, res, next) => {
  res.render("login");
});

router.get("/person", (req, res, next) => {
  res.render("person");
});

router.post(
  "/person",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/person",
    passReqToCallback: true,
  })
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/mainPage",
    failureRedirect: "/",
    passReqToCallback: true,
  })
);

router.get("/profile", isAuthenticated, (req, res, next) => {
  res.render("profile");
});

router.get(
  "/mainPage",
  /*isAuthenticated,*/ (req, res, next) => {
    res.render("mainPage");
  }
);

router.get("/listPerson", (req, res, next) => {
  Person.find()
    .then((person) => {
      res.render("personIndex", { person });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}

module.exports = router;
