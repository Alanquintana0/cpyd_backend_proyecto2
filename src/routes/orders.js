const express = require("express")
const orderItemsSchema = require('../models/order')
const router = express.Router();
const db = require('../mysqlclient');

router.get('/', async(req, res, next)=>{
    const connection = await db.create_connection();
    try {
        const data = await db.getData(connection, 'SELECT * FROM ORDERS');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    } finally {
        await db.close_connection(connection);
    }
})

router.get('/:id', async(req, res, next)=>{
    const connection = await db.create_connection();
    let order_id = req.params.id;
    try{
        const data = await db.getData(connection, `SELECT * FROM ORDERS WHERE ORDER_ID = ${order_id}`);
        res.json(data);
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'});
    }finally{
        await db.close_connection(connection);
    }
})

router.delete('/:id', async(req, res, next)=> {
    const connection = await db.create_connection();
    let order_id = req.params.id;

    try{
        await connection.execute(`DELETE FROM ORDERS WHERE ORDER_ID = ${order_id}`);
        console.log('Order deleted');
    }catch(err){
        console.error(err);
        throw err;
    }finally{
        await db.closeConnection(connection)
    }
})

router.post('/orders', async(req, res, next) => {
    const connection = await db.create_connection();
    let { ORDER_ID, ORDER_DATE, ORDER_MODE, CUSTOMER_ID, ORDER_STATUS, ORDER_TOTAL, SALES_REP_ID, PROMOTION_ID } = req.body;
    try{
        await connection.execute(
            `INSERT INTO ORDERS (ORDER_ID, ORDER_DATE, ORDER_MODE, CUSTOMER_ID, ORDER_STATUS, ORDER_TOTAL, SALES_REP_ID, PROMOTION_ID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
             [ORDER_ID, ORDER_DATE, ORDER_MODE, CUSTOMER_ID, ORDER_STATUS, ORDER_TOTAL, SALES_REP_ID, PROMOTION_ID]
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
    let { ORDER_ID, ORDER_DATE, ORDER_MODE, CUSTOMER_ID, ORDER_STATUS, ORDER_TOTAL, SALES_REP_ID, PROMOTION_ID } = req.body;
    try{
        await connection.execute(
            `UPDATE ORDERS SET ORDER_DATE = ?, ORDER_MODE = ?, CUSTOMER_ID = ?, ORDER_STATUS = ?, ORDER_TOTAL = ?, SALES_REP_ID = ?, PROMOTION_ID = ? WHERE ORDER_ID = ?`,
             [ORDER_DATE, ORDER_MODE, CUSTOMER_ID, ORDER_STATUS, ORDER_TOTAL, SALES_REP_ID, PROMOTION_ID, ORDER_ID]
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

module.exports = router;