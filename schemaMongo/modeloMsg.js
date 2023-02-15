const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const MensajeSchema = new Schema({
  autor: {
    id: { type: String, required: true, max: 100 },
    nombre: { type: String, required: true, max: 150 },
    apellido: { type: String, required: true, max: 150 },
    edad: { type: Number, required: true, max: 100 },
    alias: { type: String, required: true },
    avatar: { type: String, required: true, max: 150 },
  },
  fecha: { type: String, required: true, max: 150 },
  mensaje: { type: String, required: true, max: 150 },
});

let Mensajes = model("msgs", MensajeSchema);
module.exports = Mensajes;
