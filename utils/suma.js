const numerosRandom = (cantidad) => {
  let limite = cantidad;
  if (!limite) {
    limite = 100000000;
  }
  const min = 1;
  const max = 1000;
  let numerosTotales = [];
  for (let index = 0; index < limite; index++) {
    const numeroRandom = Math.floor(Math.random() * (max - min + 1) + min);
    numerosTotales.push(numeroRandom);
  }

  let obj = {};
  for (let index = 0; index < 1000; index++) {
    obj[index] = 0;
  }

  for (let index = 0; index < numerosTotales.length; index++) {
    obj[numerosTotales[index]] = obj[numerosTotales[index]] + 1;
  }
  return obj;
};

process.on("message", (cant) => {
  const respuesta = numerosRandom(cant);
  setTimeout(() => {
    process.send(JSON.stringify(respuesta, null, 2));
  });
});
