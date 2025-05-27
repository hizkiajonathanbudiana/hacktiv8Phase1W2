const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'DIYPlatform',
    idleTimeoutMillis: 100
});


let connect = async () => {
    try {
        let { rows } = await pool.query('SELECT NOW()');
        console.log(rows);
    } catch (error) {
        console.log(error);
    }
}
connect();
//

module.exports = pool;

