const db = require('./db');
const { DataTypes } = require('sequelize');
const Usuarios = require('./usuarios')

const Funcionarios = db.sequelize.define('funcionarios', {
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
    cpf: {
        type: DataTypes.STRING(14),
        allowNull: false,
        field: 'cpf'
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        field: 'telefone'
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'endereco'
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
        field: 'cep'
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cidade'
    },
    disponibilidade: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'disponibilidade'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'status'
    },
    usuarioID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
            onDelete: 'CASCADE'
        },
        field: 'usuarioID'
    }
}, {
    tableName: 'funcionarios'
});



module.exports = Funcionarios;
