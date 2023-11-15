const express = require("express")
const clientSchema = require('../models/customer')
const router = express.Router();
const db = require('./mysqlclient');

router.get('/', async(req, res, next)=>{
    const connection = await db.create_connection();
    try {
        const data = await db.getData(connection, 'SELECT * FROM customers');
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
        const data = await db.getData(connection, `SELECT * FROM customers WHERE id = ${customer_id}`);
        res.json(data)
    } catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
    }finally{
        await db.close_connection(connection)
    }
})

router.delete('/:id/:region', async(req, res, next)=> {
    let connection;
    customer_id = req.params.id;
    region = req.params.region;
    try{
        connection = await db.create_connection();
        await connection.execute(
            `BEGIN
                delete_customer(
                    ${customer_id},
                    ${region}
                );
             END;`,
             {
                customer_id: customer_id,
                region:region
             }
        );
        console.log("Customer deleted")
        await connection.execute('COMMIT')
    } catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        if(conn){
            try{
                await db.close_connection(connection);
            }catch(err){
                console.log(err)
            }
        }
    }
})

router.post('/customers', async(req, res, next) => {
    let connection;
    const customer_id = req.params.customer_id;
    const customer_first_name = req.params.customer_first_name;
    const customer_last_name = req.params.customer_last_name;
    const credit_limit = req.params.credit_limit;
    const customer_email = req.params.customer_email;
    const income_level = req.params.income_level;
    const region = req.params.region;

    try{
        connection = await db.create_connection();
        await connection.execute(
            `BEGIN
                create_customer(
                    ${customer_id},
                    ${customer_first_name},
                    ${customer_last_name},
                    ${credit_limit},
                    ${customer_email},
                    ${income_level},
                    ${region});
                END;`
        );
    }catch(err){
        res.status(500).json({error: 'Error al obtener los datos'})
        throw err;
    }finally{
        await db.close_connection(connection)
    }
})

router.put('/:id/:item_id', async(req, res, next)=>{
    let conn;
        try {
            conn = await db.connectToDatabase();
            await conn.execute(
                `BEGIN 
                    update_customer(
                        :customer_id,
                        :customer_first_name,
                        :customer_last_name,
                        :credit_limit,
                        :customer_email,
                        :income_level,
                        :region
                    ); 
                 END;`,
                {
                    customer_id:this.customer_id,
                    cust_first_name:this.customer_first_name,
                    cust_last_name:this.customer_last_name,
                    credit_limit:this.credit_limit,
                    cust_email:this.customer_email,
                    income_level:this.income_level,
                    region:this.region
                }
            );
            console.log('Cliente actualizado');
            await conn.execute('COMMIT');
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            if (conn) {
                await oracledb.closeConnection(conn);
            }
        }
})


