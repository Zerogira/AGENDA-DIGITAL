const { DataTypes, Model } = require('sequelize');
const db = require('./db');

const DisponibilidadeFuncionarios = db.sequelize.define('disponibilidadeFuncionarios', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'id',
},
funcionarioID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'funcionarioID'
},
dataInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'dataInicio',
},
dataFim: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'dataFim',
},
horarioInicio: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'horarioInicio',
},
horarioFim: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'horarioFim',
},
statusF: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'statusF',
},
UsuarioID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'UsuarioID',
    references: {
        model: 'Usuarios',
        key: 'id'
    },
},
eventoID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'eventos',
        key: 'id'
    },
    field: 'eventoID'
}
},{
    tableName: 'disponibilidadeFuncionarios',
});

module.exports = DisponibilidadeFuncionarios;
