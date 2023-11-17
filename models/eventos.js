const db = require('./db');
const { DataTypes } = require('sequelize');
const Usuarios = require('./usuarios')

const Eventos = db.sequelize.define('eventos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contato: {
        type: DataTypes.STRING,
    },
    horarioInicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    horarioFim: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('PARTICULAR', 'PREFEITURA', 'PARTICULAR FORA DA CIDADE', 'PREFEITURA FORA DA CIDADE'),
        allowNull: false,
    },
    endereco: {
        type: DataTypes.STRING,
    },
    cidade: {
        type: DataTypes.STRING,
    },
    dataInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    dataFim: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    },
    observacao: {
        type: DataTypes.TEXT,
    },
    usuarioID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'id'
        },
    },
}, {
    tableName: 'eventos',
});



module.exports = Eventos;
