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
  Person.findByIdAndRemove(req.params.id, req.body)
    .then(() => {
      res.redirect("/listPerson"); // Se redirige a la página de listado después de eliminar exitosamente
    })
    .catch((err) => {
      return next(err);
    });
});

router.get("/findById/:id", function (req, res, next) {
  Person.findById(req.params.id)
    .exec()
    .then((person) => {
      if (!person) {
        return res.status(404).send("Persona no encontrada");
      }
      res.render("personUpdate", { person });
    })
    .catch((err) => {
      return next(err);
    });
});

router.post("/updatePerson", function (req, res, next) {
  Person.findByIdAndUpdate(req.body.objId, {
    id: req.body.objId,
    name: req.body.name,
    lastName: req.body.edad,
    phone: req.body.phone,
    email: req.body.email,
  })
    .then(() => {
      res.redirect("/listPerson");
    })
    .catch((err) => {
      next(err);
    });
});

// ---------------A partir de aquí segunda variable--------------------------------

router.get("/listProducto", (req, res, next) => {
  Producto.find(function (err, producto) {
    if (err) return next(err);
    //res.json(person); Ahora en lugar de renderizar el json de person
    res.render("productoIndex", { producto }); //Ejecutara el archivo 'personIndex' y tambien le envia el json
  });
}); //Se crea la ruta para ver el listo de registros en la coleccion

router.get("/addProducto", function (req, res) {
  res.render("producto");
}); //Se crea el render con el objetivo poder ver el formulario donde podremos enviar los datos

router.post("/addProducto", function (req, res) {
  const myProducto = new Producto({
    codigoProducto: req.body.codigoProducto,
    provedor: req.body.provedor,
    nombre: req.body.nombre,
    cantidad: req.body.cantidad,
    precio: req.body.precio,
  }); //Se creo una nueva identidad para que permita agregar a un nuevo objeto en el coleccion de MongoDB
  myProducto.save();
  res.redirect("/addProducto");
});

// Se crea una ruta a la cual va a poder acceder el servidor para poder observar la colecion

//DELETE producto - findByIdAndRemove
router.get("/deleteProducto/:id", function (req, res, next) {
  Producto.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err); // Se crea la funcion la cual encontrara y eliminara el objeto deseado
    res.redirect("/listProducto"); // Se recarga la pagina para actualizarse
  });
});

//EDIT producto - findById
router.get("/PfindById/:id", function (req, res, next) {
  Producto.findById(req.params.id, function (err, producto) {
    if (err) return next(err); // Se crea la funcion la cual encontrara y se redirigira a la pagina de edicion
    res.render("productoUpdate", { producto }); //Renderiza la pagina de edicion
  });
});

router.post("/updateProducto", function (req, res, next) {
  Producto.findByIdAndUpdate(
    req.body.objId,
    {
      codigoProducto: req.body.codigoProducto,
      provedor: req.body.provedor,
      nombre: req.body.nombre,
      cantidad: req.body.cantidad,
      precio: req.body.precio,
    }, //Actualiza la base de datos con lo editado en la pagina
    function (err, post) {
      if (err) return next(err);
      res.redirect("/listProducto");
    }
  ); //Se redirige a la pagina de la tabla actualizada
});

// ---------------A partir de aquí tercera variable--------------------------------

router.get("/listProvedor", (req, res, next) => {
  Provedor.find(function (err, provedor) {
    if (err) return next(err);
    //res.json(person); Ahora en lugar de renderizar el json de person
    res.render("provedorIndex", { provedor }); //Ejecutara el archivo 'personIndex' y tambien le envia el json
  });
}); //Se crea la ruta para ver el listo de registros en la coleccion

router.get("/addProvedor", function (req, res) {
  res.render("provedor");
}); //Se crea el render con el objetivo poder ver el formulario donde podremos enviar los datos

router.post("/addProvedor", function (req, res) {
  const myProvedor = new Provedor({
    empresa: req.body.empresa,
    rfc: req.body.rfc,
    tipo: req.body.tipo,
    correo: req.body.correo,
    telefono: req.body.telefono,
    encargado: req.body.encargado,
  }); //Se creo una nueva identidad para que permita agregar a un nuevo objeto en el coleccion de MongoDB
  myProvedor.save();
  res.redirect("/addProvedor");
});

// Se crea una ruta a la cual va a poder acceder el servidor para poder observar la colecion

//DELETE provedor - findByIdAndRemove
router.get("/deleteProvedor/:id", function (req, res, next) {
  Provedor.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err); // Se crea la funcion la cual encontrara y eliminara el objeto deseado
    res.redirect("/listProvedor"); // Se recarga la pagina para actualizarse
  });
});

//EDIT provedor - findById
router.get("/ProvfindById/:id", function (req, res, next) {
  Provedor.findById(req.params.id, function (err, provedor) {
    if (err) return next(err); // Se crea la funcion la cual encontrara y se redirigira a la pagina de edicion
    res.render("provedorUpdate", { provedor }); //Renderiza la pagina de edicion
  });
});

router.post("/updateProvedor", function (req, res, next) {
  Provedor.findByIdAndUpdate(
    req.body.objId,
    {
      empresa: req.body.empresa,
      rfc: req.body.rfc,
      tipo: req.body.tipo,
      correo: req.body.correo,
      telefono: req.body.telefono,
      encargado: req.body.encargado,
    }, //Actualiza la base de datos con lo editado en la pagina
    function (err, post) {
      if (err) return next(err);
      res.redirect("/listProvedor");
    }
  ); //Se redirige a la pagina de la tabla actualizada
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
