const express = require("express");
const { Router } = express;
const routerProcess = Router();
const { fork } = require("child_process");
const getInfoProcess = require("../utils/info.js");

routerProcess.get("/info", async (req, res) => {
  res.render("info", getInfoProcess());
});

routerProcess.get("/api/randoms", async (req, res) => {
  const { cant } = req.query;
  const calculo = fork("./utils/suma.js");
  calculo.send(cant || 100000000);
  calculo.on("message", (obj) => {
    res.render("random", { layout: "sinChat", object: obj });
  });
});

module.exports = routerProcess;
