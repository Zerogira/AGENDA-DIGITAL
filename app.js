const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const flash = require('connect-flash');
const admin = require('./routes/admin.js');
const usuarios = require('./routes/usuario.js');
const aplication = require('./routes/aplication.js');
const passport = require("passport");
require("./config/auth.js")(passport);
const apiRouter = require('./routes/api.js');

// Configuração
// Sessão
app.use(session({
  secret: '@genda3letrnic4',
  resave: true,
  saveUninitialized: true
}));

// Middleware de sessão do Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware de verificação de autenticação
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;

  const isUsuarioPage = req.path.startsWith('/usuarios/');
  res.locals.isUsuarioPage = isUsuarioPage;
  next();
});


// Handlebars
var handle = exphbs.create({
  defaultLayout: 'main'
});
app.engine('handlebars', handle.engine);
app.set('view engine', 'handlebars');
const Handlebars = require('handlebars');
const helpers = require('./helpers/helpers.js');

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/admin', admin);
app.use('/usuarios', usuarios);
app.use('/aplication', aplication);
app.use('/api', apiRouter);

// Path publicos
app.get('/', function (req, res) {
  res.redirect('usuarios/login');
});

app.get('/menu', function (req, res) {
  res.render('menu');
});

// -------------------- ROTAS POST --------------------


app.listen(8080, function(){
    console.log('Servidor rodando na url http://localhost:8080');
})