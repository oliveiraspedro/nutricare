const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nutricare_db', // Definir nome do banco de dados
    port: '3306', // Definir porta
    connectionLimit: 10
})

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        return;
    }
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release(); // Libera a conexão de volta para o pool
});

module.exports = pool;