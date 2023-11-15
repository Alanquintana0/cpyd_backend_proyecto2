const mysql = require('mysql2/promise');

async function create_connection(){    
    const mysql_con = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT
    });

    try {
        await mysql_con.connect();
    } catch (err) {
        console.log('Error en mysql', err);
        throw err;
    }

    return mysql_con;
}

async function close_connection(connection){
    try{
        if(connection && connection.end){
            await connection.end();
        }
    }catch(err){
        throw err
    }
}

module.exports = {create_connection, close_connection}