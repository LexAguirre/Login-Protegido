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

router.get("/deletePerson/:id", function (req, res, next) {
  Person.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err); // Se crea la funcion la cual encontrara y eliminara el objeto deseado
    res.redirect("/listPerson"); // Se recarga la pagina para actualizarse
  });
});

router.get("/findById/:id", function (req, res, next) {
  Person.findById(req.params.id, function (err, person) {
    if (err) return next(err); // Se crea la funcion la cual encontrara y se redirigira a la pagina de edicion
    res.render("personUpdate", { person }); //Renderiza la pagina de edicion
  });
});

router.get("/listProducto", (req, res, next) => {
  Producto.find(function (err, producto) {
    if (err) return next(err);
    //res.json(person); Ahora en lugar de renderizar el json de person
    res.render("productoIndex", { producto }); //Ejecutara el archivo 'personIndex' y tambien le envia el json
  });
}); //Se crea la ruta para ver el listo de registros en la coleccion

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
