import pool from '../utils/connection';

class PedidoModel {
  public async crearPedido(data: any) {
    const query = `INSERT INTO productos (email, fecha, total, estado, codigo, nombre, descripcion, precio, imagen, categoria, cantidad, estadoInventario, rating) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [data.email, data.fecha, data.total, data.estado, data.codigo, data.nombre, data.descripcion, data.precio, data.imagen, data.categoria, data.cantidad, data.estadoInventario, data.rating];
    return await pool.then(async (connection) => await connection.query(query, values));
  }

  public async obtenerPedidos() {
    const query = 'SELECT * FROM productos';
    return await pool.then(async (connection) => await connection.query(query));
  }

  public async obtenerPedidoPorId(order_id: number) {
    const query = 'SELECT * FROM productos WHERE order_id = ?';
    return await pool.then(async (connection) => await connection.query(query, [order_id]));
  }

  public async actualizarPedido(order_id: number, data: any) {
    const query = `UPDATE productos SET email=?, fecha=?, total=?, estado=?, codigo=?, nombre=?, descripcion=?, precio=?, imagen=?, categoria=?, cantidad=?, estadoInventario=?, rating=? 
                   WHERE order_id=?`;
    const values = [data.email, data.fecha, data.total, data.estado, data.codigo, data.nombre, data.descripcion, data.precio, data.imagen, data.categoria, data.cantidad, data.estadoInventario, data.rating, order_id];
    return await pool.then(async (connection) => await connection.query(query, values));
  }

  public async eliminarPedido(order_id: number) {
    const query = 'DELETE FROM productos WHERE order_id = ?';
    return await pool.then(async (connection) => await connection.query(query, [order_id]));
  }
}

export default new PedidoModel();
