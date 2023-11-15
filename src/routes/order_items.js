const express = require("express")
const router = express.Router();
const db = require('../mysqlclient');

router.get('/', async(req, res, next)=>{
    const connection = await db.create_connection();
    try {
        const data = await db.getData(connection, 'SELECT * FROM ORDER_ITEMS');
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
        const data = await db.getData(connection, `SELECT * FROM ORDER_ITEMS WHERE ORDER_ID = ${order_id}`);
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
        await connection.execute(`DELETE FROM ORDER_ITEMS WHERE ORDER_ID = ${order_id}`);
        console.log('Order item deleted');
    }catch(err){
        console.error(err);
        throw err;
    }finally{
        await db.closeConnection(connection)
    }
})

router.post('/order_items', async(req, res, next) => {
    const connection = await db.create_connection();
    let { ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY } = req.body;
    try{
        await connection.execute(
            `INSERT INTO ORDER_ITEMS (ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY) 
            VALUES (?, ?, ?, ?, ?)`,
             [ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY]
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
    let { ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY } = req.body;
    try{
        await connection.execute(
            `UPDATE ORDER_ITEMS SET LINE_ITEM_ID = ?, PRODUCT_ID = ?, UNIT_PRICE = ?, QUANTITY = ? WHERE ORDER_ID = ?`,
             [LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY, ORDER_ID]
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

module.exports = router;