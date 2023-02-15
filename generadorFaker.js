const faker = require("faker");

faker.locale = "es";
const { commerce, image } = faker;

const generadorFaker = (n) => {
  let fakeProductos = [];
  for (let index = 0; index < n; index++) {
    const fakeProducto = {
      id: index + 1,
      nombre: commerce.product(),
      precio: commerce.price(10, 1000),
      imagen: image.abstract(150, 150),
    };
    fakeProductos.push(fakeProducto);
  }

  return fakeProductos;
};
// generadorFaker(5);
module.exports = generadorFaker;
