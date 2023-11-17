const Sequelize = require('sequelize')
//Conexão com o banco de dados MySql
const sequelize = new Sequelize('agendaeletronica', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    query:{raw:true},
    logging: false 
})

sequelize.sync()
    .then(() => {
        console.log('Modelos sincronizados com o banco de dados.');
    })
    .catch((erro) => {
        console.log('Ocorreu um erro ao sincronizar os modelos com o banco de dados:', erro);
    });

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
