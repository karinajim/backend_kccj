import mysql from 'promise-mysql';
import { utils } from './utils';

const pool = mysql.createPool({
<<<<<<< HEAD
    host: "127.0.0.1",//'localhost'
    port: 3308,
    user: 'root',
    password: 'root',
    database: 'db_karina_ok'
=======
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: '12345678',
    database: 'entornos'
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4

})
export default pool;
