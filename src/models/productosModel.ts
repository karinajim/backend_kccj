import { Request, Response } from "express";
import pool from "../utils/connection";

class ProductoControllers {
  public async crearProducto(req: Request, resp: Response) {
    const { email, fecha, total, estado, codigo, nombre, descripcion, precio, imagen, categoria, cantidad, estadoInventario, rating } = req.body;
    await (await pool).query(
      'INSERT INTO productos (email, fecha, total, estado, codigo, nombre, descripcion, precio, imagen, categoria, cantidad, estadoInventario, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, fecha, total, estado, codigo, nombre, descripcion, precio, imagen, categoria, cantidad, estadoInventario, rating]
    );
    resp.json('Producto creado exitosamente.');
  }

  public async getProductos(req: Request, resp: Response) {
    const productos = await (await pool).query('SELECT * FROM productos');
    resp.json(productos);
  }

  public async getUnProducto(req: Request, resp: Response) {
    const { order_id } = req.params;
    const producto = await (await pool).query('SELECT * FROM productos WHERE order_id = ?', [order_id]);
    resp.json(producto);
  }

  public async borrarProducto(req: Request, resp: Response) {
    const { order_id } = req.params;
    await (await pool).query('DELETE FROM productos WHERE order_id = ?', [order_id]);
    resp.json('Producto eliminado.');
  }

  public async modificarProducto(req: Request, resp: Response) {
    const { order_id } = req.params;
    const { email, fecha, total, estado, codigo, nombre, descripcion, precio, imagen, categoria, cantidad, estadoInventario, rating } = req.body;
    await (await pool).query(
      'UPDATE productos SET email=?, fecha=?, total=?, estado=?, codigo=?, nombre=?, descripcion=?, precio=?, imagen=?, categoria=?, cantidad=?, estadoInventario=?, rating=? WHERE order_id=?',
      [email, fecha, total, estado, codigo, nombre, descripcion, precio, imagen, categoria, cantidad, estadoInventario, rating, order_id]
    );
    resp.json('Producto actualizado.');
  }
}

const productoControllers = new ProductoControllers();
export default productoControllers;
