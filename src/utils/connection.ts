import mysql from 'promise-mysql';

const pool = mysql.createPool({
    host: "127.0.0.1",//'localhost'
    port: 3308,
    user: 'root',
    password: 'root',
    database: 'db_karina_ok'

})
export default pool;