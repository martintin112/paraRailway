require("dotenv").config();

const mongoSession = process.env.MONGOSESSION;
const mongoUsuarios = process.env.MONGOUSUARIOS;

module.exports = { mongoSession, mongoUsuarios };
