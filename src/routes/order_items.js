const express = require("express")
const orderItemsSchema = require('../models/customer')
const router = express.Router();
const db = require('../mysqlclient');

router.get('/', async(req, res, next)=>{
    const connection = await db.create_connection();
    try {
        const data = await db.getData(connection, 'SELECT * FROM order_items');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    } finally {
        await db.close_connection(connection);
    }
})

router.get('/:id', async(req, res, next)=>{
    const connection = await db.create_connection();
    let order_item = req.params.id;
    try{
        const data = await db.getData(connection, `SELECT * FROM order_items WHERE order_id = ${order_item}`);
        res.json(data);
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'});
    }finally{
        await db.close_connection(connection);
    }
})

router.delete('/:id/:item_id', async(req, res, next)=> {
    const connection = await db.create_connection();
    let order_item_id = req.body.id;
    let line_item_id = req.body.item_id;

    try{
        connection = await oracledb.connectToDatabase();
        await connection.execute(
            `BEGIN 
                delete_order_item(
                    :order_id,
                    :line_item_id
                ); 
             END;`,
             {
                order_id:order_id,
                line_time_id:line_item_id
             }
        );
        console.log('order_item deleted');
        await connection.execute('COMMIT');
    }catch(err){
        console.error(err);
        throw err;
    }finally{
        await db.closeConnection(connection)
    }
})

router.post('/customers', async(req, res, next) => {
    const connection = await db.create_connection();
    let { order_id, line_item_id, product_id, unit_price, quantity } = req.body;
    try{
        connection = await db.create_connection();
        await connection.execute(
            `BEGIN
                create_order_item(
                    :order_id,
                    :line_item_id,
                    :product_id,
                    :unit_price,
                    :quantity);
             END;`,
             {
                order_id,
                line_item_id,
                product_id,
                unit_price,
                quantity
             }
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

router.put('/:id/:item_id', async(req, res, next)=>{
    const connection = await db.create_connection();
    let { order_id, line_item_id, product_id, unit_price, quantity } = req.body;
    try{
        connection = await db.create_connection();
        await connection.execute(
            `BEGIN
                update_order_item(
                    :order_id,
                    :line_item_id,
                    :product_id,
                    :unit_price,
                    :quantity);
             END;`,
             {
                order_id,
                line_item_id,
                product_id,
                unit_price,
                quantity
             }
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

module.exports = router;