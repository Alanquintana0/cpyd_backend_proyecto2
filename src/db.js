const oracledb = require('oracledb');

async function connectToDatabase(){
    try{
        let connection = await oracledb.getConnection({
            user: 'system',
            password: 'oracle',
            connectString: 'localhost:1521/xe'
        });
        console.log('Connected to database');
        return connection;
    }catch(err){
        console.log(err);
    }
}

async function closeConnection(connection){
    try{
        await connection.close();
        console.log('Connection closed')
    }catch(err){
        console.log(err);
    }
}

module.exports = {connectToDatabase, closeConnection}