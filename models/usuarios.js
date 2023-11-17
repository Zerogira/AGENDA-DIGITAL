const db = require('./db');
const { DataTypes } = require('sequelize');


const Usuario = db.sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'id' 
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nome' 
      },
      usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'usuario' 
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'email' 
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'senha' 
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cpf' 
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'telefone' 
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'endereco' 
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cep' 
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cidade' 
      },
      eAdmin: {
        type: DataTypes.BOOLEAN,
        default: 0,
        field: 'eAdmin' 
      }
  },{
    tableName: 'usuarios' 
  });
  
  module.exports = Usuario;