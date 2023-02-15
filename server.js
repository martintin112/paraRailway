const express = require("express");
const session = require("express-session");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { engine } = require("express-handlebars");
const generadorFaker = require("./generadorFaker.js");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
let Mensajes = require("./schemaMongo/modeloMsg.js");
const Usuarios = require("./schemaMongo/usuarios.js");
const checkAuthentication = require("./middlewares/auth.js");
const bcrypt = require("bcrypt");
const rutas = require("./routes");
const routerProcess = require("./routes/routerProcess.js");
const { mongoSession, mongoUsuarios } = require("./config.js");

const moment = require("moment");
const formatoTiempo = moment().format("DD MM YYYY hh:mm ss a");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");
app.set("views", "./views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultlayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);
// CONECCION A MONGO
mongoose
  .connect(mongoUsuarios)
  .then(() => console.log("\x1b[32m", "Connected to Mongo ✅"))
  .catch((e) => {
    console.error(e);
    throw "can not connect to the mongo! ❌";
  });

//FUNCION VERIFICADORA DE PASSWORD
function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}
//FUNCION ENCRIPTADORA PASSWORD
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
//LOGIN PASSPORT
passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        console.log("User Not Found with username " + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }

      return done(null, user);
    });
  })
);
//SIGNUP PASSPORT
passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log("❌ Error in SignUp: " + err);
          return done(err);
        }

        if (user) {
          console.log("User already exists");
          return done(null, false);
        }

        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, userWithId) => {
          if (err) {
            console.log("❌ Error in Saving user: " + err);
            return done(err);
          }
          console.log(user);
          console.log("User Registration succesful ✅");
          return done(null, userWithId);
        });
      });
    }
  )
);
//PASSPORT SERIALIZE
passport.serializeUser((user, done) => {
  done(null, user._id);
});
//PASSPORT DESERIALIZE
passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});

// LOGIN Y SESIONES
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoSession,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    cookie: { maxAge: 60000 * 10 },

    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
//INICIAR PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// INICIAR SESION
app.get("/", rutas.getRoot);

app.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/loginFail",
  }),
  rutas.postLogin
);

app.get("/login", rutas.getLogin);

app.get("/signup", rutas.getSignup);
app.post(
  "/signup",
  passport.authenticate("signup", {
    failureRedirect: "/signupFail",
  }),
  rutas.postSignup
);

//FAILS
app.get("/signupFail", rutas.signupFail);
app.get("/loginFail", rutas.loginFail);
// DESLOGUEARSE
app.get("/logout", rutas.getLogout);

// SHOWSESSION
app.get("/showsession", (req, res) => {
  const infoSesion = JSON.stringify(req.session, null, 4);

  res.render("session", { layout: "logueo", session: infoSesion });
});

// INFOPRIVADA
app.get("/informacionconfidencial", checkAuthentication, (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  res.render("privado", {
    layout: "logueo",
    user,
    admin: req.session.admin,
  });
});

//RUTAS PROCESS
app.use("/", routerProcess);
app.use("/", routerProcess);

//RUTAS FAIL
app.get("*", rutas.failRoute);

//SOCKET

io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);
  socket.emit("product-list", await generadorFaker(5));
  socket.emit("msg-list", await Mensajes.find());

  socket.on("msg", async (data) => {
    const mensaje = new Mensajes({ fecha: formatoTiempo, ...data });
    console.log(mensaje);
    await mensaje.save();
    io.emit("msg-list", await Mensajes.find());
  });
});

httpServer.listen(process.env.PORT || 8080, () =>
  console.log(`http://localhost:${process.env.PORT || 8080}`)
);
