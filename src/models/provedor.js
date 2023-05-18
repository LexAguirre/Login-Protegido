const mongoose = require("mongoose");

let ProvedorSchema = new mongoose.Schema({
  empresa: String,
  tipo: String,
  correo: String,
  telefono: String,
  encargado: String,
  rfc: String,
});

module.exports = mongoose.model("Provedor", ProvedorSchema);
