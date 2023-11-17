const db = require('./db');
const { DataTypes } = require('sequelize');

const Avisos = db.sequelize.define('avisos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'id'
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'titulo'
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'descricao'
    },
    dataRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'dataRegistro'
    },
    dataPrazo: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'dataPrazo'
    },
    statusA: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'statusA'
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
    tableName: 'avisos'
});



module.exports = Avisos;
