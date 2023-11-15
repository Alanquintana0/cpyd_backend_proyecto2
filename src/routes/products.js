const express = require("express")
const router = express.Router();
const db = require('../mysqlclient');

router.get('/', async(req, res, next)=>{
    const connection = await db.create_connection();
    try {
        const data = await db.getData(connection, 'SELECT * FROM PRODUCT_INFORMATION');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    } finally {
        await db.close_connection(connection);
    }
})

router.get('/:id', async(req, res, next)=>{
    const connection = await db.create_connection();
    let product_id = req.params.id;
    try{
        const data = await db.getData(connection, `SELECT * FROM PRODUCT_INFORMATION WHERE PRODUCT_ID = ${product_id}`);
        res.json(data);
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'});
    }finally{
        await db.close_connection(connection);
    }
})

router.delete('/:id', async(req, res, next)=> {
    const connection = await db.create_connection();
    let product_id = req.params.id;

    try{
        await connection.execute(`DELETE FROM PRODUCT_INFORMATION WHERE PRODUCT_ID = ${product_id}`);
        console.log('Product deleted');
    }catch(err){
        console.error(err);
        throw err;
    }finally{
        await db.closeConnection(connection)
    }
})

router.post('/product_information', async(req, res, next) => {
    const connection = await db.create_connection();
    let { PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, CATEGORY_ID, WEIGHT_CLASS, WARRANTY_PERIOD, SUPPLIER_ID, PRODUCT_STATUS, LIST_PRICE, MIN_PRICE, CATALOG_URL } = req.body;
    try{
        await connection.execute(
            `INSERT INTO PRODUCT_INFORMATION (PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, CATEGORY_ID, WEIGHT_CLASS, WARRANTY_PERIOD, SUPPLIER_ID, PRODUCT_STATUS, LIST_PRICE, MIN_PRICE, CATALOG_URL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
             [PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, CATEGORY_ID, WEIGHT_CLASS, WARRANTY_PERIOD, SUPPLIER_ID, PRODUCT_STATUS, LIST_PRICE, MIN_PRICE, CATALOG_URL]
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
    let { PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, CATEGORY_ID, WEIGHT_CLASS, WARRANTY_PERIOD, SUPPLIER_ID, PRODUCT_STATUS, LIST_PRICE, MIN_PRICE, CATALOG_URL } = req.body;
    try{
        await connection.execute(
            `UPDATE PRODUCT_INFORMATION SET PRODUCT_NAME = ?, PRODUCT_DESCRIPTION = ?, CATEGORY_ID = ?, WEIGHT_CLASS = ?, WARRANTY_PERIOD = ?, SUPPLIER_ID = ?, PRODUCT_STATUS = ?, LIST_PRICE = ?, MIN_PRICE = ?, CATALOG_URL = ? WHERE PRODUCT_ID = ?`,
             [PRODUCT_NAME, PRODUCT_DESCRIPTION, CATEGORY_ID, WEIGHT_CLASS, WARRANTY_PERIOD, SUPPLIER_ID, PRODUCT_STATUS, LIST_PRICE, MIN_PRICE, CATALOG_URL, PRODUCT_ID]
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

module.exports = router;