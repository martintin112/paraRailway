function getRoot(req, res) {
  res.render("products");
}

function getLogin(req, res) {
  if (req.isAuthenticated()) {
    const { username, password } = req.user;
    const user = { username, password };
    res.render("logueado", { layout: "logueo", user });
  } else {
    res.render("login", { layout: "sinChat" });
  }
}

function getSignup(req, res) {
  if (req.isAuthenticated()) {
    const { username, password } = req.user;
    const user = { username, password };
    res.render("logueado", { layout: "logueo", user });
  } else {
    res.render("signup", { layout: "sinChat" });
  }
}

function postLogin(req, res) {
  const { username, password } = req.user;
  const user = { username, password };
  req.session.admin = true;
  res.render("logueado", { layout: "logueo", user });
}

function postSignup(req, res) {
  const { username, password } = req.user;
  const user = { username, password };
  res.render("logueado", { layout: "logueo", user });
}

function getLogout(req, res) {
  const { username, password } = req.user;
  const user = { username, password };
  res.render("logout", { layout: "logueo", user });
  req.logout();
}

function failRoute(req, res) {
  res.status(404).render("routingFail", { layout: "sinChat" });
}

function signupFail(req, res) {
  res.render("signupFail", { layout: "logueo" });
}

function loginFail(req, res) {
  res.render("loginFail", { layout: "logueo" });
}

module.exports = {
  getRoot,
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  getLogout,
  failRoute,
  signupFail,
  loginFail,
};
