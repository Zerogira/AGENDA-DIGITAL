const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport");
const router = require('./usuario.js');


const {eAdmin} = require('../helpers/eAdmin.js')

router.get('/menuadmin',eAdmin, (req, res) => {
    res.render('admin/menuadmin')
})



module.exports = router