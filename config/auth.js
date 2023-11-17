const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

//Model de usuario
const Usuario = require('../models/usuarios');

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (emailOrUsername, senha, done) => {
            Usuario.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrUsername },
                        { usuario: emailOrUsername }
                    ]
                }
            })
            .then((usuario) => {
                if (!usuario) {
                    return done(null, false, { message: 'Essa conta não existe' });
                }
                bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                    if (batem) {
                        return done(null, usuario);
                    } else {
                        return done(null, false, { message: 'Senha incorreta' });
                    }
                });
            })
            .catch((erro) => {
                return done(erro);
            });
        })
    );

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findByPk(id)
            .then((usuario) => {
                done(null, usuario);
            })
            .catch((erro) => {
                done(erro);
            });
    });
};
