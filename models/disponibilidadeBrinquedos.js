const { DataTypes, Model } = require('sequelize');
const db = require('./db');

const DisponibilidadeBrinquedos = db.sequelize.define('disponibilidadeBrinquedos', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'id',
},
brinquedoID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'brinquedoID' 
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
quantidade: {
    type: DataTypes.JSON, 
    allowNull: false,
    field: 'quantidade',
},
minimoFuncionario: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'minimoFuncionario',
},
statusB: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'statusB',
},
usuarioID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'usuarios',
        key: 'id'
    },
    field: 'usuarioID'
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
    tableName: 'disponibilidadeBrinquedos',
});




module.exports = DisponibilidadeBrinquedos;
