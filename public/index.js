const socket = io();

socket.on("connect", () => {
  console.log("me conecte!");
});

const msgEnviado = () => {
  const enviarMSg = document.getElementById("input-msg").value;
  const email = document.getElementById("input-email").value;
  const nombre = document.getElementById("input-nombre").value;
  const apellido = document.getElementById("input-apellido").value;
  const edad = document.getElementById("input-edad").value;
  const alias = document.getElementById("input-alias").value;
  const avatar = document.getElementById("input-avatar").value;
  const dataMsg = {
    autor: {
      id: email,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      alias: alias,
      avatar: avatar,
    },
    mensaje: enviarMSg,
  };
  socket.emit("msg", dataMsg);
  return false;
};

// const infoUser = () => {
//   const usuario = document.getElementById("input-usuario").value;
//   const contraseña = document.getElementById("input-contraseña").value;
//   socket.emit("infoUser", { usuario, contraseña });
//   return false;
// };

socket.on("msg-list", (data) => {
  let html = "";
  data.forEach((element) => {
    html += `
      <div style="display:flex;">
      <p style="color:blue;">${element.autor.id}</p> <p>[</p><p style="color:red;">${element.fecha}</p><p>]:</p> <p style="color:green;">${element.mensaje}</p>
     </div>`;
  });
  document.getElementById("msg-listado").innerHTML = html;
});

socket.on("product-list", (data) => {
  let html = "";
  data.forEach((item) => {
    html += `
        <tr>
            <th scope="row">${item.id}</th>
            <td>${item.nombre}</td>
            <td>${item.precio}</td>
            <td><img  src="${item.imagen}" alt="${item.nombre}" style="width: 80px;"/><td>
        </tr>
        `;
  });
  document.getElementById("productosContenedor").innerHTML = html;
});
