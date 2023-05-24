const express = require("express");
const router = express.Router();
let Person = require("../models/person");
let Producto = require("../models/producto");
let Provedor = require("../models/provedor");

const passport = require("passport");

router.get("/", (req, res, next) => {
  res.render("login");
});

router.get("/person", isAuthenticated, (req, res, next) => {
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

router.get("/mainPage", isAuthenticated, (req, res, next) => {
  // res.render("mainPage");
  Person.find()
    .then((person) => {
      res.render("mainPage", { person });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/listPerson", isAuthenticated, (req, res, next) => {
  Person.find()
    .then((person) => {
      res.render("personIndex", { person });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/deletePerson/:id", isAuthenticated, function (req, res, next) {
  Person.findByIdAndRemove(req.params.id, req.body)
    .then(() => {
      res.redirect("/listPerson"); // Se redirige a la página de listado después de eliminar exitosamente
    })
    .catch((err) => {
      return next(err);
    });
});

router.get("/findById/:id", isAuthenticated, function (req, res, next) {
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

router.post("/updatePerson", isAuthenticated, async (req, res, next) => {
  await Person.findByIdAndUpdate(req.body.id, {
    id: req.body.id,
    name: req.body.name,
    lastName: req.body.lastName,
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

router.get("/listProducto", isAuthenticated, (req, res, next) => {
  Producto.find()
    .exec()
    .then((producto) => {
      res.render("productoIndex", { producto });
    })
    .catch((err) => {
      next(err);
    });
});
//Se crea la ruta para ver el listo de registros en la coleccion

router.get("/addProducto", isAuthenticated, function (req, res) {
  res.render("producto");
}); //Se crea el render con el objetivo poder ver el formulario donde podremos enviar los datos

router.post("/addProducto", isAuthenticated, function (req, res) {
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
router.get("/deleteProducto/:id", isAuthenticated, function (req, res, next) {
  Producto.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/listProducto");
    })
    .catch((err) => {
      next(err);
    });
});

//EDIT producto - findById
router.get("/PfindById/:id", isAuthenticated, function (req, res, next) {
  Producto.findById(req.params.id)
    .then((producto) => {
      if (!producto) {
        return res.status(404).send("Producto no encontrado");
      }
      res.render("productoUpdate", { producto });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/updateProducto", isAuthenticated, function (req, res, next) {
  Producto.findByIdAndUpdate(req.body.objId, {
    codigoProducto: req.body.codigoProducto,
    provedor: req.body.provedor,
    nombre: req.body.nombre,
    cantidad: req.body.cantidad,
    precio: req.body.precio,
  })
    .then(() => {
      res.redirect("/listProducto");
    })
    .catch((err) => {
      next(err);
    });
});

// ---------------A partir de aquí tercera variable--------------------------------

router.get("/listProvedor", isAuthenticated, (req, res, next) => {
  Provedor.find()
    .exec()
    .then((provedor) => {
      res.render("provedorIndex", { provedor });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/addProvedor", isAuthenticated, function (req, res) {
  res.render("provedor");
}); //Se crea el render con el objetivo poder ver el formulario donde podremos enviar los datos

router.post("/addProvedor", isAuthenticated, function (req, res) {
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
router.get("/deleteProvedor/:id", isAuthenticated, function (req, res, next) {
  Provedor.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/listProvedor"); // Se redirige a la página de la lista actualizada
    })
    .catch((err) => {
      next(err);
    });
});

//EDIT provedor - findById
router.get("/ProvfindById/:id", isAuthenticated, function (req, res, next) {
  Provedor.findById(req.params.id)
    .then((provedor) => {
      if (!provedor) {
        return res.status(404).send("Proveedor no encontrado");
      }
      res.render("provedorUpdate", { provedor }); // Renderiza la página de edición con el proveedor encontrado
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/updateProvedor", isAuthenticated, function (req, res, next) {
  Provedor.findByIdAndUpdate(req.body.objId, {
    empresa: req.body.empresa,
    rfc: req.body.rfc,
    tipo: req.body.tipo,
    correo: req.body.correo,
    telefono: req.body.telefono,
    encargado: req.body.encargado,
    id: req.body._ID,
  })
    .then(() => {
      res.redirect("/listProvedor"); // Se redirige a la página de la tabla actualizada
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

function isntAdmin(req, res, next) {
  if (person[prop].isAdmin != true) {
    res.redirect("/");
  }
}

module.exports = router;
