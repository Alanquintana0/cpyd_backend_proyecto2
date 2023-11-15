const express = require("express")
const router = express.Router();
const db = require('../mysqlclient');

router.get('/', async(req, res, next)=>{
    const connection = await db.create_connection();
    try {
        const data = await db.getData(connection, 'SELECT * FROM CUSTOMERS');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    } finally {
        await db.close_connection(connection);
    }
})

router.get('/:id', async(req, res, next)=>{
    const connection = await db.create_connection();
    let customer_id = req.params.id;
    try{
        const data = await db.getData(connection, `SELECT * FROM CUSTOMERS WHERE CUSTOMER_ID = ${customer_id}`);
        res.json(data);
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'});
    }finally{
        await db.close_connection(connection);
    }
})

router.delete('/:id', async(req, res, next)=> {
    const connection = await db.create_connection();
    let customer_id = req.params.id;

    try{
        await connection.execute(`DELETE FROM CUSTOMERS WHERE CUSTOMER_ID = ${customer_id}`);
        console.log('Customer deleted');
    }catch(err){
        console.error(err);
        throw err;
    }finally{
        await db.closeConnection(connection)
    }
})

router.post('/customers', async(req, res, next) => {
    const connection = await db.create_connection();
    let { CUSTOMER_ID, CUST_FIRST_NAME, CUST_LAST_NAME, CREDIT_LIMIT, CUST_EMAIL, INCOME_LEVEL, REGION } = req.body;
    try{
        await connection.execute(
            `INSERT INTO CUSTOMERS (CUSTOMER_ID, CUST_FIRST_NAME, CUST_LAST_NAME, CREDIT_LIMIT, CUST_EMAIL, INCOME_LEVEL, REGION) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
             [CUSTOMER_ID, CUST_FIRST_NAME, CUST_LAST_NAME, CREDIT_LIMIT, CUST_EMAIL, INCOME_LEVEL, REGION]
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

router.put('/:id', async(req, res, next)=>{
    const connection = await db.create_connection();
    let { CUSTOMER_ID, CUST_FIRST_NAME, CUST_LAST_NAME, CREDIT_LIMIT, CUST_EMAIL, INCOME_LEVEL, REGION } = req.body;
    try{
        await connection.execute(
            `UPDATE CUSTOMERS SET CUST_FIRST_NAME = ?, CUST_LAST_NAME = ?, CREDIT_LIMIT = ?, CUST_EMAIL = ?, INCOME_LEVEL = ?, REGION = ? WHERE CUSTOMER_ID = ?`,
             [CUST_FIRST_NAME, CUST_LAST_NAME, CREDIT_LIMIT, CUST_EMAIL, INCOME_LEVEL, REGION, CUSTOMER_ID]
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

module.exports = router;