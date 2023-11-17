const express = require ("express")
const router = express.Router()
const Usuario = require('../models/usuarios');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const passport = require("passport")


router.get('/cadastro', function(req,res){
    res.render('usuarios/cadastro')
})

router.get('/login', function(req,res){
    res.render('usuarios/login')
})

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) {
            req.flash('error_msg', 'Erro ao fazer logout');
            return res.redirect('/usuarios/login');
        }
        req.flash('success_msg', 'Deslogado com sucesso!');
        res.redirect('/usuarios/login');
    });
});

// ROTAS POST 
router.post('/cadastro/add', function(req, res) {
    var erros = [];
    var nome = req.body.nome;
    var usuario = req.body.usuario;
    var email = req.body.email;
    var senha = req.body.senha;
    var conf_senha = req.body.conf_senha;
    var cpf = req.body.cpf;
    var telefone = req.body.telefone;
    var endereco = req.body.endereco;
    var cep = req.body.cep;
    var cidade = req.body.cidade;

    if (!usuario || typeof usuario === 'undefined' || usuario === null) {
        erros.push({ texto: 'Nome de usuário inválido' });
    }
    if (usuario.length < 2) {
        erros.push({ texto: 'Nome de usuário muito curto' });
    }

    if (!email || typeof email === 'undefined' || email === null) {
        erros.push({ texto: 'Email inválido' });
    }

    if (email.length < 10) {
        erros.push({ texto: 'Email muito curto' });
    }

    if (!senha || typeof senha === 'undefined' || senha === null) {
        erros.push({ texto: 'Senha inválida' });
    } else {
        if (senha !== conf_senha) {
            erros.push({ texto: 'Senhas não conferem' });
        }
        if (senha.length < 4) {
            erros.push({ texto: 'Senha muito curta' });
        }
    }

    if (!nome || nome.length < 2) {
        erros.push({ texto: 'Nome completo é obrigatório e deve ter pelo menos 2 caracteres.' });
    }
    
    if (!cpf || cpf.lengh < 14) {
        erros.push({ texto: 'CPF inválido. Deve ter 11 números.' });
    }
    
    if (!telefone || telefone.lengh < 14) {
        erros.push({ texto: 'Número de telefone inválido. Deve ter 9 números.' });
    }
    
    if (!endereco || endereco.length < 2) {
        erros.push({ texto: 'Endereço é obrigatório e deve ter pelo menos 2 caracteres.' });
    }
    
    if (!cep || cep.lengh < 9) {
        erros.push({ texto: 'CEP inválido. Deve ter 8 números.' });
    }
    
    if (!cidade || cidade.length < 2) {
        erros.push({ texto: 'Cidade é obrigatória e deve ter pelo menos 2 caracteres.' });
    }

    if (erros.length > 0) {
        return res.render('usuarios/cadastro', { erros: erros });
    } else {
        const emailPattern = email.replace(/@/g, '@%');
        Usuario.findOne({
            where: {
                [Op.or]: [
                    { email: { [Op.like]: emailPattern } },
                    { usuario: usuario }
                ]
            }
        }).then((usuarioEncontrado) => {
            if (usuarioEncontrado) {
            } else {
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash('error_msg', "Houve um erro durante o salvamento do usuário");
                            console.log('erro: ',erro);
                            res.redirect('/');
                        } else {
                            Usuario.create({
                                nome: nome,
                                usuario: usuario,
                                email: email,
                                senha: hash,
                                cpf: cpf,
                                telefone: telefone,
                                endereco: endereco,
                                cep: cep,
                                cidade: cidade,
                                eAdmin: false
                            })
                            .then(function() {
                                req.flash("success_msg", "Usuário criado com sucesso!");
                                console.log('Sucesso no flash');
                                res.redirect('/usuarios/login');
                            })
                            .catch(function(erro) {
                                req.flash("error_msg", "Houve um erro ao cadastrar, tente novamente!");
                                console.log('Erro no flash', erro);
                                res.redirect('/usuarios/cadastro');
                            });
                        }
                    });
                });
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno', err);
            res.redirect('/');
        });
    }
});



router.post('/login/entrar', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/aplication/menu',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
});

router.post('/usuario/editar', function(req, res) {
    var erros = [];
    var nome = req.body.nome;
    var usuario = req.body.usuario;
    var email = req.body.email;
    var cpf = req.body.cpf;
    var telefone = req.body.telefone;
    var endereco = req.body.endereco;
    var cep = req.body.cep; 
    var cidade = req.body.cidade; 

    var id = req.body.userId; // Obtenha o ID do parâmetro da URL

    if (!usuario || typeof usuario === 'undefined' || usuario === null) {
        erros.push({ texto: 'Nome de usuário inválido' });
    }
    if (usuario.length < 2) {
        erros.push({ texto: 'Nome de usuário muito curto' });
    }

    if (!email || typeof email === 'undefined' || email === null) {
        erros.push({ texto: 'Email inválido' });
    }

    if (email.length < 10) {
        erros.push({ texto: 'Email muito curto' });
    }

    if (!nome || nome.length < 2) {
        erros.push({ texto: 'Nome completo é obrigatório e deve ter pelo menos 2 caracteres.' });
    }
    
    if (!cpf || cpf.lengh < 14) {
        erros.push({ texto: 'CPF inválido. Deve ter 11 números.' });
    }
    
    if (!telefone || telefone.lengh < 14) {
        erros.push({ texto: 'Número de telefone inválido. Deve ter 9 números.' });
    }
    
    if (!endereco || endereco.length < 2) {
        erros.push({ texto: 'Endereço é obrigatório e deve ter pelo menos 2 caracteres.' });
    }
    
    if (!cep || cep.lengh < 9) {
        erros.push({ texto: 'CEP inválido. Deve ter 8 números.' });
    }
    
    if (!cidade || cidade.length < 2) {
        erros.push({ texto: 'Cidade é obrigatória e deve ter pelo menos 2 caracteres.' });
    }

    if (erros.length > 0) {
        console.log('Erros: ',erros)
        res.status(400).json({ success: false, errors: erros });
    } else {
        Usuario.update(
            {
                nome: nome,
                usuario: usuario,
                email: email,
                cpf: cpf,
                telefone: telefone,
                endereco: endereco,
                cep: cep, 
                cidade: cidade
            },
            {
                where: {
                    id: id
                }
            }
        )
        .then(function(result) {
            console.log("Usuário atualizado:", result);
            res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso!' });
        })
        .catch(function(erro) {
            console.error('Erro ao atualizar usuário:', erro);
            res.status(500).json({ success: false, message: 'Erro ao atualizar usuário. Por favor, tente novamente.' });
        })
    }
});

router.post('/trocar-senha', function(req, res) {
    const { userId, novaSenha } = req.body;

    // Hash da nova senha
    bcrypt.hash(novaSenha, 10, function(err, hash) {
        if (err) {
            // Se ocorrer um erro durante o hash da senha, retorne uma resposta de erro
            return res.status(500).json({ success: false, message: 'Erro ao alterar a senha.' });
        }

        // Atualize a senha no banco de dados usando o where com o ID do usuário
        Usuario.update({ senha: hash }, { where: { id: userId } })
            .then(result => {
                // Verifique se algum registro foi atualizado
                if (result[0] === 0) {
                    // Nenhum registro foi atualizado (usuário com o ID especificado não encontrado)
                    return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
                }
                // Senha alterada com sucesso
                return res.status(200).json({ success: true, message: 'Senha alterada com sucesso!' });
            })
            .catch(error => {
                // Erro ao atualizar a senha no banco de dados
                console.error(error);
                return res.status(500).json({ success: false, message: 'Erro ao alterar a senha.' });
            });
    });
});

module.exports = router