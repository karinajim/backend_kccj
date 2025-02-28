import mysql from 'promise-mysql';
import { utils } from './utils';

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: '12345678',
    database: 'entornos'

})
export default pool;
