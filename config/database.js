// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('newdatabase', 'user2', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
