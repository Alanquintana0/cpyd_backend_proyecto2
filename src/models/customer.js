const oracledb = require("oracledb");

class Customer{
    constructor(customer_id, customer_first_name, customer_last_name, credit_limit, customer_email, income_level, region){
        this.customer_id = customer_id;
        this.customer_first_name = customer_first_name;
        this.customer_last_name = customer_last_name;
        this.credit_limit = credit_limit;
        this.customer_email = customer_email;
        this.income_level = income_level;
        this.region = region;
    }

    static async findAll(){
        let conn
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT * FROM customers');
            return result.rows.map(row => {
                return{
                    customer_id:row[0],
                    customer_first_name:row[1],
                    customer_last_name:row[2],
                    credit_limit:row[3],
                    customer_email:row[4],
                    income_level:row[5],
                    region:row[6]
                };
            })
        }catch(err){
            throw err;
        }finally{
            if(conn){
                await oracledb.closeConnection(conn)
            }
        }
    }

    static async findById(customer_id){
        let conn
        try{
            conn = await oracledb.connectToDatabase()
            const result = await conn.execute(`SELECT * FROM customers WHERE customer_id = ${customer_id}`)
            if(result.rows.length>0){
                return{
                    customer_id:row[0],
                    customer_first_name:row[1],
                    customer_last_name:row[2],
                    credit_limit:row[3],
                    customer_email:row[4],
                    income_level:row[5],
                    region:row[6]
                };
            }else{
                return 'Cliente no encontrado';
            }
        }catch(err){
            throw err;
        }finally{
            if(conn){
                await oracledb.closeConnection(conn)
            }
        }
    }

    async save(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute(
                'BEGIN create_customer(:customer_id,:customer_first_name,:customer_last_name,:credit_limit,:customer_email,:income_level,:region);END;',
                [this.customer_id,this.customer_first_name,this.customer_last_name,this.credit_limit,this.customer_email,this.income_level,this.region]
            );
            console.log('Cliente creado');
            await conn.execute('COMMIT');
        }catch(err){
            throw err;
        }finally{
            if(conn){
                await oracledb.closeConnection()
            }
        }
    }

    async update() {
        let conn;
        try {
            conn = await oracledb.connectToDatabase();
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
    }

    static async destroy(customer_id, region){
        let conn
        try{
            conn = await oracledb.connectToDatabase()
            await conn.execute(
                `BEGIN
                    delete_customer(
                        :customer_id,
                        :region
                    );
                END`,
                {
                    customer_id:customer_id,
                    region:region
                }
            );
            console.log('Cliente eliminado');
            await conn.execute('COMMIT');
        }catch(err){
            console.error(err);
            throw err;
        }finally{
            await oracledb.closeConnection(conn)
        }
    }
}

module.exports = Customer
