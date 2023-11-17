const express = require('express');
const router = express.Router();
const DisponibilidadeBrinquedos = require('../models/disponibilidadeBrinquedos');
const DisponibilidadeFuncionarios = require('../models/disponibilidadeFuncionarios'); 
const Brinquedos = require ('../models/brinquedos');
const Funcionarios = require ('../models/funcionarios');
const Eventos = require ('../models/eventos');
const Avisos = require ('../models/avisos');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

router.get('/disponibilidade-brinquedos', async (req, res) => {
  try {
    const disponibilidade = await DisponibilidadeBrinquedos.findAll();
    res.json(disponibilidade);
  } catch (error) {
    console.error('Erro ao obter dados de disponibilidade de brinquedos:', error);
    res.status(500).json({ error: 'Erro ao obter dados de disponibilidade de brinquedos' });
  }
});

router.get('/disponibilidade-funcionarios', async (req, res) => {
  try {
    const disponibilidade = await DisponibilidadeFuncionarios.findAll();
    res.json(disponibilidade);
  } catch (error) {
    console.error('Erro ao obter dados de disponibilidade de funcionários:', error);
    res.status(500).json({ error: 'Erro ao obter dados de disponibilidade de funcionários' });
  }
});

router.get('/eventos', async (req, res) => {
  try {
    const eventos = await Eventos.findAll(); 
    res.json(eventos); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar eventos.' });
  }
  });

router.get('/eventos/:id', async (req, res) => {
    try {
      const eventoId = req.params.id;

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
        attributes: ['brinquedoId'] // Atributo do ID do brinquedo
      });
  
      const disponibilidadeFuncionarios = await DisponibilidadeFuncionarios.findAll({
        where: {
          eventoId: eventoId
        },
        attributes: ['funcionarioId'] // Atributo do ID do funcionário
      });
  
      // Mapeia os IDs de brinquedos para seus nomes
      const nomesBrinquedos = await Promise.all(disponibilidadeBrinquedos.map(async (item) => {
        const brinquedo = await Brinquedos.findByPk(item.brinquedoId);
        return brinquedo ? brinquedo.nome : null;
      }));
  
      // Mapeia os IDs de funcionários para seus nomes
      const nomesFuncionarios = await Promise.all(disponibilidadeFuncionarios.map(async (item) => {
        const funcionario = await Funcionarios.findByPk(item.funcionarioId);
        return funcionario ? funcionario.nome : null;
      }));

      const dataParaEnviar = {
        evento: eventoPesquisado,
        nomesBrinquedos: nomesBrinquedos,
        nomesFuncionarios: nomesFuncionarios
      };
      
      res.json(dataParaEnviar);
    } catch (error) {
      console.error('Erro ao buscar detalhes do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
router.put('/atualizar-aviso/:id', async (req, res) => {
  const avisoId = req.params.id;

  try {
    const { statusA } = req.body;

    await Avisos.update(
      { statusA: statusA }, 
      { where: { id: avisoId } } 
    );

    res.status(200).json({ message: 'Aviso concluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao concluir aviso:', error);
    res.status(500).json({ error: 'Erro ao concluir aviso.' });
  }
});

router.post('/editar-aviso/:id', async (req, res) => {
  const avisoId = req.params.id;
  const { titulo, descricao, prazo } = req.body;

  try {
    const rowsUpdated = await Avisos.update(
      {
        titulo: titulo,
        descricao: descricao,
        dataPrazo: prazo,
      },
      {
        where: {
          id: avisoId
        },
        returning: true,
      }
    );

    if (rowsUpdated[0] === 0) {
      return res.status(404).json({ error: 'Aviso não encontrado.' });
    }

    const aviso = await Avisos.findByPk(avisoId);

    res.status(200).json({ message: 'Aviso atualizado com sucesso.', aviso });
  } catch (error) {
    console.error('Erro ao atualizar aviso:', error);
    res.status(500).json({ error: 'Erro ao atualizar aviso.' });
  }
});

router.delete('/excluir-aviso/:id', async (req, res) => {
  const avisoId = req.params.id;

  try {
      const aviso = await Avisos.findByPk(avisoId);

      if (!aviso) {
          return res.status(404).json({ error: 'Aviso não encontrado.' });
      }

      await Avisos.destroy({
          where: {
              id: avisoId
          }
      });

      res.status(200).json({ message: 'Aviso excluído com sucesso.' });
  } catch (error) {
      console.error('Erro ao excluir aviso:', error);
      res.status(500).json({ error: 'Erro ao excluir aviso.' });
  }
});

router.post('/eventos-data', async (req, res) => {
  try {
      const dataInicio = req.body.dataInicio;
      
      const eventos = await Eventos.findAll({
          where: {
              dataInicio: dataInicio
          }
      });

      const eventosComInformacoes = await Promise.all(eventos.map(async (evento) => {
          const disponibilidadeBrinquedos = await DisponibilidadeBrinquedos.findAll({
              where: {
                  eventoId: evento.id
              },
              attributes: ['brinquedoId', 'quantidade']
          });
  
          const disponibilidadeFuncionarios = await DisponibilidadeFuncionarios.findAll({
              where: {
                  eventoId: evento.id
              },
              attributes: ['funcionarioId']
          });
  
          const quantidadesBrinquedos = disponibilidadeBrinquedos.reduce((quantidades, item) => {
            console.log('disponibilidadeBrinquedos: ',disponibilidadeBrinquedos)
            return quantidades.concat(item.quantidade);
          }, []);

          const nomesBrinquedos = await Promise.all(disponibilidadeBrinquedos.map(async (item) => {
            const brinquedo = await Brinquedos.findByPk(item.brinquedoId);
            return brinquedo ? brinquedo.nome : null;
          }));
  
          const nomesFuncionarios = await Promise.all(disponibilidadeFuncionarios.map(async (item) => {
              const funcionario = await Funcionarios.findByPk(item.funcionarioId);
              return funcionario ? funcionario.nome : null;
          }));

          return {
              evento: evento,
              nomesBrinquedos: nomesBrinquedos,
              nomesFuncionarios: nomesFuncionarios,
              quantidadesBrinquedos: quantidadesBrinquedos
          };
      }));

      eventosComInformacoes.sort(function(a, b) {
      });

      res.json(eventosComInformacoes);
  } catch (error) {
      console.error('Erro ao buscar eventos do banco de dados:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/pesquisar-eventos', async (req, res) => {
  const { dataInicio, dataFim } = req.body;
  
  try {
    const eventos = await Eventos.findAll({
      where: {
          dataInicio: {
              [Op.and]: {
                  [Op.gte]: dataInicio,
                  [Op.lte]: dataFim 
              }
          }
      }
  });
  
      res.status(200).json({ eventos });
  } catch (error) {
      console.error('Erro ao pesquisar eventos:', error);
      res.status(500).json({ error: 'Erro ao pesquisar eventos.' });
  }
  
});

router.post('/eventosComplemento/:id', async (req, res) => {
  try {
    const eventoId = req.params.id;

    const disponibilidadeBrinquedos = await DisponibilidadeBrinquedos.findAll({
      where: {
        eventoId: eventoId
      },
      attributes: ['brinquedoId', 'quantidade']
    });

    const quantidadesBrinquedos = disponibilidadeBrinquedos.reduce((quantidades, item) => {
      console.log('disponibilidadeBrinquedos: ',disponibilidadeBrinquedos)
      return quantidades.concat(item.quantidade);
    }, []);

    const disponibilidadeFuncionarios = await DisponibilidadeFuncionarios.findAll({
      where: {
        eventoId: eventoId
      },
      attributes: ['funcionarioId']
    });

    const nomesBrinquedos = await Promise.all(disponibilidadeBrinquedos.map(async (item) => {
      const brinquedo = await Brinquedos.findByPk(item.brinquedoId);
      return brinquedo ? brinquedo.nome : null;
    }));

    const nomesFuncionarios = await Promise.all(disponibilidadeFuncionarios.map(async (item) => {
      const funcionario = await Funcionarios.findByPk(item.funcionarioId);
      return funcionario ? funcionario.nome : null;
    }));

    const dataParaEnviar = {
      nomesBrinquedos: nomesBrinquedos,
      nomesFuncionarios: nomesFuncionarios,
      quantidadesBrinquedos: quantidadesBrinquedos
    };
    res.json(dataParaEnviar);
  } catch (error) {
    console.error('Erro ao buscar detalhes do evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/gerar-pdf', async (req, res) => {
  try {
    // Obtém os dados dos eventos filtrados da requisição
    const eventosFiltrados = req.body.eventosFiltradosGlobal;
    const dataInicio = req.body.dataInicio;
    const dataFim = req.body.dataFim;

    console.log('Rota api dados - Eventos Filtrados: ', eventosFiltrados);
    console.log('Rota api dados - Data de Início: ', dataInicio);
    console.log('Rota api dados - Data de Fim: ', dataFim);

    // Cria um novo documento PDF
    const doc = new PDFDocument();
    
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    
    // Adiciona a hora e os minutos ao nome do arquivo
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    
    // Diretório de download do usuário
    const downloadDir = path.join(os.homedir(), 'Downloads');
    
    // Nome do arquivo com data, hora e minutos
    const nomeArquivo = `relatorio-${dia}-${mes}-${ano}.pdf`;

    // Caminho completo
    const outputPath = path.join(downloadDir, nomeArquivo);
    const stream = fs.createWriteStream(outputPath);
    
    // Pipe PDF 
    doc.pipe(stream);

// Define os estilos
const estilos = {
  titulo: { fontSize: 20, bold: true },
  informacoesGerais: { fontSize: 16, bold: true },
  textoNormal: { fontSize: 12 }
};

// Adiciona as datas ao documento PDF na mesma linha
doc.fontSize(estilos.titulo.fontSize).text(`RELATÓRIO`, { align: 'center' });

doc.moveDown(); // Adiciona espaço

doc.fontSize(estilos.textoNormal.fontSize).text(`Início: ${dataInicio} -|- Fim: ${dataFim}`, { align: 'center' });

doc.moveDown(); // Adiciona espaço

// Adiciona os dados ao documento PDF
eventosFiltrados.forEach(item => {
  doc.fontSize(estilos.informacoesGerais.fontSize).text(`Informações Gerais: `, estilos.informacoesGerais);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Título: ${item.titulo}`, estilos.titulo);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Data de Início: ${item.dataInicio}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Data de Fim: ${item.dataFim}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Contato: ${item.contato}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Endereço: ${item.endereco}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Cidade: ${item.cidade}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Tipo: ${item.tipo}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Observações: ${item.observacao}`, estilos.textoNormal);
  doc.fontSize(estilos.textoNormal.fontSize).text(`Status: ${item.status}`, estilos.textoNormal);

  doc.fontSize(12).text(`Brinquedos: ${item.nomesBrinquedos.map((brinquedo, index) => `${brinquedo} (${item.quantidadesBrinquedos[index]}x)`).join(', ')}`, { align: 'left' });
  doc.fontSize(12).text(`Funcionários: ${item.nomesFuncionarios.map((funcionario) => funcionario).join(', ')}`, { align: 'left' });


  doc.moveDown();
  doc.moveDown();
});




    // Finaliza o documento PDF
    doc.end();

    stream.on('finish', () => {
      // Verifique o arquivo após a conclusão da escrita
      fs.stat(outputPath, (err, stats) => {
        if (err) {
          console.error('Erro ao verificar o arquivo:', err);
        } else {
          console.log('Arquivo criado com sucesso:', stats);
        }
      });
    });

    // Envia uma resposta indicando que o arquivo PDF foi gerado com sucesso
    res.status(200).sendFile(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar o arquivo PDF.');
  }
});

module.exports = router;