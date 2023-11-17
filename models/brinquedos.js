const db = require('./db');
const { DataTypes } = require('sequelize');
const Usuarios = require('./usuarios')


const Brinquedos = db.sequelize.define('brinquedos', {
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
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'descricao'
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'marca'
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantidade'
    },
    statusB: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'statusB'
    },
    necessFuncionario: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'necessFuncionario'
    },
    usuarioId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'usuarios', 
            key: 'id',
            onDelete: 'CASCADE'
        },
        field: 'usuarioId'
    }
}, {
    tableName: 'brinquedos'
});



module.exports = Brinquedos;
