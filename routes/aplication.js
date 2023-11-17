const express = require ("express")
const router = express.Router()
const path = require('path');
const fs = require('fs');
const Funcionarios = require('../models/funcionarios');
const Brinquedos = require('../models/brinquedos');
const DisponibilidadeBrinquedos = require('../models/disponibilidadeBrinquedos');
const DisponibilidadeFuncionarios = require('../models/disponibilidadeFuncionarios');
const Eventos = require('../models/eventos');
const passport = require("passport");
const Avisos = require('../models/avisos');

function formatarDataA(data) {
    if (typeof data === 'string' && data.trim() !== '') {
        const partes = data.split('-');

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    }
    
    return data;
}

router.get('/menu', async (req, res) => {
    if (req.isAuthenticated()) {
        const usuarioIdLogado = req.user.id;
        
        try {
            const avisos = await Avisos.findAll({
                where: {
                    usuarioID: usuarioIdLogado
                }
            });
            avisos.sort((a, b) => new Date(a.dataPrazo) - new Date(b.dataPrazo));

            avisos.forEach(aviso => {
                aviso.dataPrazo = formatarDataA(aviso.dataPrazo);
                aviso.dataRegistro = formatarDataA(aviso.dataRegistro);
            });
            
            res.render('aplication/menu', { avisos: avisos });
        } catch (error) {
            req.flash("error_msg", "Houve um erro ao consultar a página Inicio");
            console.log('Erro', error);
            res.redirect('/aplication/menu');
        }
    } else {
        res.redirect('/usuarios/login');
    }
});




router.get('/agendar', async (req, res) => {
    if (req.isAuthenticated()) {
    const usuarioIdLogado = req.user.id;

    try {
        const brinquedos = await Brinquedos.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        });

        const funcionarios = await Funcionarios.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        });

        const disponibilidadeBrinquedos = await DisponibilidadeBrinquedos.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        }
        );

        const disponibilidadeFuncionarios = await DisponibilidadeFuncionarios.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        }
        );

        res.render('aplication/agendar', { brinquedos, funcionarios, disponibilidadeBrinquedos, disponibilidadeFuncionarios });
    } catch (error) {
        req.flash("error_msg", "Houve um erro ao consultar a página Agendar");
        console.log('Erro', error);
        res.redirect('/aplication/menu');
    }
    } else {
        res.redirect('/usuarios/login');
    }
});

router.get('/editar-evento/:eventoId', async (req, res) => {
    if (req.isAuthenticated()) {
        const usuarioIdLogado = req.user.id;
        try {
            const eventoId = req.params.eventoId;
            console.log('EventoIDssss: ',eventoId)

            const brinquedos = await Brinquedos.findAll({
                where: {
                    usuarioId: usuarioIdLogado
                }
            });
    
            const funcionarios = await Funcionarios.findAll({
                where: {
                    usuarioId: usuarioIdLogado
                }
            });
    
            const disponibilidadeBrinquedosFull = await DisponibilidadeBrinquedos.findAll({
                where: {
                    usuarioId: usuarioIdLogado
                }
            }
            );
    
            const disponibilidadeFuncionariosFull = await DisponibilidadeFuncionarios.findAll({
                where: {
                    usuarioId: usuarioIdLogado
                }
            }
            );
            // Busca os detalhes do evento pelo ID
            const eventoPesquisado = await Eventos.findAll({
                where: {
                    id: eventoId
                },
    
            });
        
            if (!eventoPesquisado) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }
        
            // Busca os IDs de brinquedos e funcionários nas tabelas de disponibilidade
            const disponibilidadeBrinquedos = await DisponibilidadeBrinquedos.findAll({
                where: {
                    eventoId: eventoId
                },
                attributes: ['brinquedoId', 'quantidade', 'minimoFuncionario']
            });
        
            const disponibilidadeFuncionarios = await DisponibilidadeFuncionarios.findAll({
                where: {
                    eventoId: eventoId
                },
                attributes: ['funcionarioId']
            });

            // Mapeia os IDs de brinquedos para seus nomes
            const nomesBrinquedos = await Promise.all(disponibilidadeBrinquedos.map(async (item) => {
                console.log('Item: ',item)
                const brinquedo = await Brinquedos.findByPk(item.brinquedoId);
                if (brinquedo) {
                    return {
                        id: brinquedo.id,
                        nome: brinquedo.nome,
                        necessFuncionario: brinquedo.necessFuncionario,
                        quantidade: item.quantidade,
                        minimoFuncionario: item.minimoFuncionario
                    };
                } else {
                    return null;
                }
            }));
        
            const nomesFuncionarios = await Promise.all(disponibilidadeFuncionarios.map(async (item) => {
                const funcionario = await Funcionarios.findByPk(item.funcionarioId);
                if (funcionario) {
                    return {
                        id: funcionario.id,
                        nome: funcionario.nome
                    };
                } else {
                    return null;
                }
            }));
    
            console.log('Brinquedos para handlebars: ',nomesBrinquedos,' Funcionarios: ',nomesFuncionarios)
            console.log('Evento pesquisado para handlebars: ',eventoPesquisado)
            res.render('aplication/editar-evento', { eventoPesquisado, nomesBrinquedos, nomesFuncionarios, brinquedos, funcionarios, disponibilidadeBrinquedosFull, disponibilidadeFuncionariosFull });
        } catch (error) {
            req.flash("error_msg", "Houve um erro ao consultar a página Agendar");
            console.log('Erro', error);
            res.redirect('/aplication/menu');
        }
    } else {
        res.redirect('/usuarios/login');
    }
});


router.get('/calendar', async (req, res) => {
    if (req.isAuthenticated()) {
    const usuarioIdLogado = req.user.id;

    try {
        res.render('aplication/calendar', { layout: 'main' });
    } catch (error) {
        req.flash("error_msg", "Houve um erro ao consultar a página Agendar");
        console.log('Erro', error);
        res.redirect('/aplication/calendar');
    }
    } else {
        res.redirect('/usuarios/login');
    }
});

router.get('/perfil', (req, res) => {
    console.log('Request to /perfil:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.render('aplication/perfil', { user: req.user });
    } else {
        res.redirect('/usuarios/login');
    }
});

router.get('/brinquedos', (req, res) => {
    if (req.isAuthenticated()) {
        const usuarioIdLogado = req.user.id;
        
        Brinquedos.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        })
        .then(function(brinquedos) {
            res.render('aplication/brinquedos', { brinquedos: brinquedos });
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao consultar os brinquedos");
            console.log('Erro', erro)
            res.redirect('/aplication/menu');
        });
    } else {
        res.redirect('/usuarios/login'); 
    }
});



router.get('/funcionarios', (req, res) => {
    if (req.isAuthenticated()) {
        const usuarioIdLogado = req.user.id;
        
        Funcionarios.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        })
        .then(function(funcionarios) {
            res.render('aplication/funcionarios', { funcionarios: funcionarios });
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao consultar os funcionarios");
            console.log('Erro', erro)
            res.redirect('/aplication/menu');
        });
    } else {
        res.redirect('/usuarios/login');
    }
});


router.get('/relatorios', (req, res) => {
    if (req.isAuthenticated()) {
        const usuarioIdLogado = req.user.id;
        
        Avisos.findAll({
            where: {
                usuarioId: usuarioIdLogado
            }
        })
        .then(function(avisos) {
            res.render('aplication/relatorios', { avisos: avisos });
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao consultar os dados");
            console.log('Erro', erro)
            res.redirect('/aplication/menu');
        });
    } else {
        res.redirect('/usuarios/login');
    }
});

//ROTAS POST
router.post('/funcionarios/novo', function(req, res) {
    var erros = [];
    var nome = req.body.nome;
    var cpf = req.body.cpf;
    var telefone = req.body.telefone;
    var endereco = req.body.endereco;
    var cep = req.body.cep; 
    var cidade = req.body.cidade; 
    var status = req.body.status;
    var disponibilidade = req.body.disponibilidade;

    var usuarioID = req.user.id;
    console.log('id do usuario: ',usuarioID)

    if (!nome || nome.trim() === '') {
        erros.push({ texto: 'Nome inválido' });
    }

    if (!cpf || cpf.trim() === '') {
        erros.push({ texto: 'CPF inválido' });
    }

    if (!telefone || telefone.trim() === '') {
        erros.push({ texto: 'Telefone inválido' });
    }

    if (!endereco || endereco.trim() === '') {
        erros.push({ texto: 'Endereço inválido' });
    }

    if (!cep || cep.trim() === '') { 
        erros.push({ texto: 'CEP inválido' });
    }

    if (!cidade || cidade.trim() === '') { 
        erros.push({ texto: 'Cidade inválida' });
    }

    if (!disponibilidade) {
        erros.push({ texto: 'Disponibilidade inválida' });
    }

    if (!status || !['Disponível', 'Indisponível', 'Ferias', 'Em pausa'].includes(status)) {
        erros.push({ texto: 'Status inválido' });
    }

    nome = nome.toUpperCase();
    cpf = cpf.toUpperCase();
    telefone = telefone.toUpperCase();
    endereco = endereco.toUpperCase();
    cidade = cidade.toUpperCase();

    if (erros.length > 0) {
        return res.render('aplication/funcionarios', { erros: erros }); 
    } else {
        Funcionarios.create({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            endereco: endereco,
            cep: cep, 
            cidade: cidade, 
            disponibilidade: disponibilidade,
            status: status, 
            usuarioID: usuarioID
        })
        .then(function() {
            req.flash("success_msg", "Funcionário criado com sucesso!");
            res.redirect('/aplication/funcionarios');
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao cadastrar o funcionário, tente novamente!");
            console.log('Erro', erro)
            res.redirect('/aplication/funcionarios');
        });
    }
});


router.post('/funcionarios/editar', function(req, res) {
    var erros = [];
    var nome = req.body.nome;
    var cpf = req.body.cpf;
    var telefone = req.body.telefone;
    var endereco = req.body.endereco;
    var cep = req.body.cep; 
    var cidade = req.body.cidade; 
    var disponibilidade = req.body.disponibilidade;
    var status = req.body.status; 

    var id = req.body.id;

    if (!nome || nome.trim() === '') {
        erros.push({ texto: 'Nome inválido' });
    }

    if (!cpf || cpf.trim() === '') {
        erros.push({ texto: 'CPF inválido' });
    }

    if (!telefone || telefone.trim() === '') {
        erros.push({ texto: 'Telefone inválido' });
    }

    if (!endereco || endereco.trim() === '') {
        erros.push({ texto: 'Endereço inválido' });
    }

    if (!cep || cep.trim() === '') { 
        erros.push({ texto: 'CEP inválido' });
    }

    if (!cidade || cidade.trim() === '') { 
        erros.push({ texto: 'Cidade inválida' });
    }

    if (!disponibilidade) {
        erros.push({ texto: 'Disponibilidade inválida' });
    }

    if (!status || !['Disponível', 'Indisponível', 'Ferias', 'Em pausa'].includes(status)) {
        erros.push({ texto: 'Status inválido' });
    }

    nome = nome.toUpperCase();
    cpf = cpf.toUpperCase();
    telefone = telefone.toUpperCase();
    endereco = endereco.toUpperCase();
    cidade = cidade.toUpperCase();

    if (erros.length > 0) {
        return res.render('aplication/funcionarios', { erros: erros }); 
    } else {
        Funcionarios.update(
            {
                nome: nome,
                cpf: cpf,
                telefone: telefone,
                endereco: endereco,
                cep: cep, 
                cidade: cidade, 
                disponibilidade: disponibilidade,
                status: status 
            },
            {
                where: {
                    id: id
                }
            }
        )
        .then(function(result) {
            console.log("Funcionário atualizado:", result);
            req.flash("success_msg", "Funcionário atualizado com sucesso!");
            res.redirect('/aplication/funcionarios');
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao atualizar o funcionário, tente novamente!");
            console.log('Erro', erro)
            res.redirect('/aplication/funcionarios');
        });
    }
});

router.post('/excluirfuncionario/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID do funcionário a ser excluído:", id);

        await Funcionarios.destroy({
            where: { id: id }
        });

        console.log("Funcionário excluído com sucesso");

        res.redirect('/aplication/funcionarios');
    } catch (error) {
        console.error(error);
        res.status(500).send('Não foi possível deletar o funcionário.');
    }
});

router.post('/brinquedos/novo', function(req, res) {
    var erros = [];
    var nome = req.body.nome;
    var marca = req.body.marca;
    var descricao = req.body.descricao;
    var quantidade = req.body.quantidade;
    var statusB = 'DISPONIVEL';
    var necessFuncionario = req.body.necessFuncionario === 'on'; 
    var usuarioId = req.user.id;

    console.log('STATUSB:  ', statusB);

    if (!nome || nome.trim() === '') {
        erros.push({ texto: 'Nome inválido' });
    }

    if (!marca || marca.trim() === '') {
        erros.push({ texto: 'Marca inválida' });
    }

    if (!descricao || descricao.trim() === '') {
        erros.push({ texto: 'Descrição inválida' });
    }

    if (!quantidade || isNaN(quantidade) || quantidade > 999999999) {
        erros.push({ texto: 'Quantidade inválida' });
    }

    nome = nome.toUpperCase();
    marca = marca.toUpperCase();

    if (erros.length > 0) {
        return res.render('aplication/brinquedos', { erros: erros }); 
    } else {
        Brinquedos.create({
            nome: nome,
            marca: marca,
            descricao: descricao,
            quantidade: quantidade,
            necessFuncionario: necessFuncionario,
            statusB: statusB,
            usuarioId: usuarioId
        })
        .then(function() {
            req.flash("success_msg", "Brinquedo registrado com sucesso!");
            res.redirect('/aplication/brinquedos');
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao registrar o brinquedo, tente novamente!");
            console.log('Erro', erro)
            res.redirect('/aplication/brinquedos');
        });
    }
});

router.post('/brinquedos/editar', function(req, res) {
    var erros = [];
    var id = req.body.id;
    var nome = req.body.nome;
    var marca = req.body.marca;
    var descricao = req.body.descricao;
    var quantidade = req.body.quantidade;
    var necessFuncionario = req.body.necessFuncionario === 'on'; 
    var statusB = req.body.statusB;
    

    console.log('Nome do Brinquedo: ', nome);
    console.log('Marca: ', marca);
    console.log('Descrição: ', descricao);
    console.log('Quantidade: ', quantidade);
    console.log('Status: ', statusB);
    console.log('Necessário Funcionário: ', necessFuncionario);
    console.log('ID do usuario: ',id)

    if (!nome || nome.trim() === '') {
        erros.push({ texto: 'Nome inválido' });
    }

    if (!marca || marca.trim() === '') {
        erros.push({ texto: 'Marca inválida' });
    }

    if (!descricao || descricao.trim() === '') {
        erros.push({ texto: 'Descrição inválida' });
    }

    if (!quantidade || isNaN(quantidade)) {
        erros.push({ texto: 'Quantidade inválida' });
    }

    nome = nome.toUpperCase();
    marca = marca.toUpperCase();

    if (erros.length > 0) {
        return res.render('aplication/brinquedos', { erros: erros }); 
    } else {
        Brinquedos.update({
            nome: nome,
            marca: marca,
            descricao: descricao,
            quantidade: quantidade,
            necessFuncionario: necessFuncionario,
            statusB: statusB
        },
        {
            where: {
                id: id
            }
        })
        .then(function() {
            req.flash("success_msg", "Brinquedo criado com sucesso!");
            res.redirect('/aplication/brinquedos');
        })
        .catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao cadastrar o brinquedo, tente novamente!");
            console.log('Erro', erro)
            res.redirect('/aplication/brinquedos');
        });
    }
});

router.post('/excluirbrinquedo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID do Brinquedo a ser excluído:", id);

        await Brinquedos.destroy({
            where: { id: id }
        });

        console.log("Brinquedo excluído com sucesso");

        res.redirect('/aplication/brinquedos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Não foi possível deletar o brinquedo.');
    }
});

router.post('/eventos/novo', function(req, res) {
    var erros = [];
    var titulo = req.body.titulo;
    var horarioInicio = req.body.horarioInicio;
    var horarioFim = req.body.horarioFim;
    var tipo = req.body.tipo;
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var dataInicio = req.body.dataInicio;
    var dataFim = req.body.dataFim;
    var contato = req.body.contato;
    var observacao = req.body.observacao;
    var usuarioID = req.user.id;
    var status = 'ABERTA';
    var minimoFuncionarios = req.body.quantidadeMinimaFuncionarios;

    var brinquedoID = req.body.brinquedoID || [];
    var funcionarioID = req.body.funcionarioID || [];
    var quantidades = req.body.quantidades|| [];

    console.log('brinquedoID: ',brinquedoID)
    console.log('funcionarioID: ',funcionarioID)
    console.log('quantidades: ',quantidades)

    if (!titulo || titulo.trim() === '') {
        erros.push({ texto: 'Título inválido' });
    }
    if (!horarioInicio || horarioInicio.trim() === '') {
        erros.push({ texto: 'Horário de Início inválido' });
    }
    if (!horarioFim || horarioFim.trim() === '') {
        erros.push({ texto: 'Horário de Fim inválido' });
    }
    if (!tipo || tipo.trim() === '') {
        erros.push({ texto: 'Tipo inválido' });
    }
    if (!endereco || endereco.trim() === '') {
        erros.push({ texto: 'Endereço inválido' });
    }
    if (!cidade || cidade.trim() === '') {
        erros.push({ texto: 'Cidade inválida' });
    }
    if (!dataInicio || dataInicio.trim() === '') {
        erros.push({ texto: 'Data de Início inválida' });
    }
    if (!dataFim || dataFim.trim() === '') {
        erros.push({ texto: 'Data de Fim inválida' });
    }
    if (!contato || contato.trim() === '') {
        erros.push({ texto: 'Contato inválido' });
    }

    titulo = titulo.toUpperCase();
    endereco = endereco.toUpperCase();
    cidade = cidade.toUpperCase();
    contato = contato.toUpperCase();
    observacao = observacao.toUpperCase();

    if (erros.length > 0) {
        console.log('erros: ',erros)
        return res.render('aplication/agendar', { erros: erros });
    } else {
        Eventos.create({
            titulo: titulo,
            contato: contato,
            horarioInicio: horarioInicio,
            horarioFim: horarioFim,
            tipo: tipo,
            endereco: endereco,
            cidade: cidade,
            dataInicio: dataInicio,
            dataFim: dataFim,
            status: status,
            observacao: observacao,
            usuarioID: usuarioID
        })
        .then(function(eventoCriado) {
            brinquedoID.forEach((brinquedoID, index) => {
                DisponibilidadeBrinquedos.create({
                    brinquedoID: brinquedoID,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    horarioInicio: horarioInicio,
                    horarioFim: horarioFim,
                    statusB: 'ABERTO',
                    minimoFuncionario: minimoFuncionarios,
                    quantidade: quantidades[index],
                    usuarioID: usuarioID,
                    eventoID: eventoCriado.id 
                })
                .then(function(brinquedoCriado) {
                    console.log('Registro de Disponibilidade de Brinquedo criado com sucesso!');
                })
                .catch(function(erro) {
                    console.error('Erro ao criar registro de Disponibilidade de Brinquedo:', erro);
                });
            });
        
            funcionarioID.forEach(funcionarioID => {
                console.log('funcionarioID',funcionarioID)
                DisponibilidadeFuncionarios.create({
                    funcionarioID: funcionarioID,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    horarioInicio: horarioInicio,
                    horarioFim: horarioFim,
                    statusF: 'ABERTO',
                    UsuarioID: usuarioID,
                    eventoID: eventoCriado.id
                })
                .then(function(funcionarioCriado) {
                    console.log('Evento e disponibilidades atualizados com sucesso!');
                    res.status(200).json({ message: 'Evento atualizado com sucesso!' });
                })
                .catch(function(erro) {
                    console.error('Erro ao criar registro de Disponibilidade de Funcionário:', erro);
                });
            });
        })
    }
});

router.post('/eventos/editar/:eventoId', function(req, res) {
    var eventoId = req.params.eventoId;
    var erros = [];
    var titulo = req.body.titulo;
    var horarioInicio = req.body.horarioInicio;
    var horarioFim = req.body.horarioFim;
    var tipo = req.body.tipo;
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var dataInicio = req.body.dataInicio;
    var dataFim = req.body.dataFim;
    var contato = req.body.contato;
    var observacao = req.body.observacao;
    var usuarioID = req.user.id;
    var status = 'ABERTA';
    var minimoFuncionarios = req.body.quantidadeMinimaFuncionarios;

    var brinquedoID = req.body.brinquedoID || [];
    var funcionarioID = req.body.funcionarioID || [];
    var quantidades = req.body.quantidades|| [];

    console.log('Evento id: ',eventoId)
    console.log('brinquedoID: ',brinquedoID)
    console.log('funcionarioID: ',funcionarioID)
    console.log('quantidades: ',quantidades)

    if (!titulo || titulo.trim() === '') {
        erros.push({ texto: 'Título inválido' });
    }
    if (!horarioInicio || horarioInicio.trim() === '') {
        erros.push({ texto: 'Horário de Início inválido' });
    }
    if (!horarioFim || horarioFim.trim() === '') {
        erros.push({ texto: 'Horário de Fim inválido' });
    }
    if (!tipo || tipo.trim() === '') {
        erros.push({ texto: 'Tipo inválido' });
    }
    if (!endereco || endereco.trim() === '') {
        erros.push({ texto: 'Endereço inválido' });
    }
    if (!cidade || cidade.trim() === '') {
        erros.push({ texto: 'Cidade inválida' });
    }
    if (!dataInicio || dataInicio.trim() === '') {
        erros.push({ texto: 'Data de Início inválida' });
    }
    if (!dataFim || dataFim.trim() === '') {
        erros.push({ texto: 'Data de Fim inválida' });
    }
    if (!contato || contato.trim() === '') {
        erros.push({ texto: 'Contato inválido' });
    }

    titulo = titulo.toUpperCase();
    endereco = endereco.toUpperCase();
    cidade = cidade.toUpperCase();
    contato = contato.toUpperCase();
    observacao = observacao.toUpperCase();

    if (erros.length > 0) {
        console.log('erros: ',erros)
        return res.render('aplication/agendar', { erros: erros });
    } else {
        Eventos.update({
            titulo: titulo,
            contato: contato,
            horarioInicio: horarioInicio,
            horarioFim: horarioFim,
            tipo: tipo,
            endereco: endereco,
            cidade: cidade,
            dataInicio: dataInicio,
            dataFim: dataFim,
            status: status,
            observacao: observacao,
            usuarioID: usuarioID
        },
        {
            where: {
                id: eventoId 
            }
        })
        .then(function(eventoCriado) {
            brinquedoID.forEach((brinquedoID, index) => {
                DisponibilidadeBrinquedos.update({
                    brinquedoID: brinquedoID,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    horarioInicio: horarioInicio,
                    horarioFim: horarioFim,
                    statusB: 'ABERTO',
                    minimoFuncionario: minimoFuncionarios,
                    quantidade: quantidades[index],
                    usuarioID: usuarioID,
                    eventoID: eventoCriado.id 
                },
                {
                    where: {
                        id: eventoId 
                    }
                })
                .then(function(brinquedoCriado) {
                    console.log('Registro de Disponibilidade de Brinquedo criado com sucesso!');
                })
                .catch(function(erro) {
                    console.error('Erro ao criar registro de Disponibilidade de Brinquedo:', erro);
                });
            });
        
            funcionarioID.forEach(funcionarioID => {
                console.log('funcionarioID',funcionarioID)
                DisponibilidadeFuncionarios.update({
                    funcionarioID: funcionarioID,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    horarioInicio: horarioInicio,
                    horarioFim: horarioFim,
                    statusF: 'ABERTO',
                    UsuarioID: usuarioID,
                    eventoID: eventoCriado.id
                },
                {
                    where: {
                        id: eventoId
                    }
                })
                .then(function(funcionarioCriado) {
                    console.log('Evento e disponibilidades atualizados com sucesso!');
                    res.status(200).json({ message: 'Evento atualizado com sucesso!' });
                })
                .catch(function(erro) {
                    console.error('Erro ao criar registro de Disponibilidade de Funcionário:', erro);
                });
            });
        })
    }
});

router.post('/marcar-concluido/:id', async (req, res) => {
    const eventoId = req.params.id;
    const novoStatus = req.body.status;

    console.log('EventoId: ',eventoId)

    try {
        await Eventos.update({ status: novoStatus }, { where: { id: eventoId } });
        res.json({ message: 'Evento marcado como concluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao marcar evento como concluído:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/avisos/novo', async (req, res) => {
    const titulo = req.body.titulo;
	const mensagem = req.body.mensagem ;
	const prazo = req.body.prazo;
    const registro = req.body.registro;
    var usuarioID = req.user.id;

    console.log('prazo: ',prazo)

    try {
        const novoAviso = await Avisos.create({
            titulo: titulo,
            descricao: mensagem,
            dataPrazo: prazo,
            dataRegistro: registro,
            statusA: 'ABERTO',
            usuarioID: usuarioID
        });

        res.status(201).json(novoAviso);
    } catch (error) {
        req.flash("error_msg", "Houve um erro ao criar um aviso.");
        console.log('Erro', error);
        res.redirect('/aplication/menu');
    }
});

module.exports = router