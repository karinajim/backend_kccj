import { Request, Response } from "express";
import pool from "../utils/connection";

class ProductoController {
  public async listarProducto(req: Request, resp: Response) {
    try {
      const productoList = await pool.then(async (connection) => {
        return await connection.query(`
          SELECT 
            id, 
            nombre, 
            descripcion, 
            precio, 
            categoria, 
            imagen, 
            cantidad_stock AS cantidad, 
            estado_inventario AS estadoInventario, 
            rating 
          FROM productos
        `);
      });
      
      resp.status(200).json({
        message: "Listado de Productos",
        productos: productoList,
        total: productoList.length
      });
    } catch (error: any) {
      resp.status(500).json({
        message: `Error al listar productos: ${error.message}`,
        code: 500
      });
    }
  }

  public async listarUnProducto(req: Request, resp: Response) {
    try {
      const { id } = req.params;
      console.log(id)
      const producto = await pool.then(async (connection) => {
        return await connection.query(`
          SELECT 
            id, 
            nombre, 
            descripcion, 
            precio, 
            categoria, 
            imagen, 
            cantidad_stock AS cantidad, 
            estado_inventario AS estadoInventario, 
            rating,
            fecha_creacion
          FROM productos 
          WHERE id = ?
        `, [id]);
      });

      if (producto.length === 0) {
        return resp.status(404).json({
          message: "Producto no encontrado",
          code: 404
        });
      }

      resp.status(200).json({
        message: "Producto encontrado",
        producto: producto[0]
      });
    } catch (error: any) {
      resp.status(500).json({
        message: `Error al buscar producto: ${error.message}`,
        code: 500
      });
    }
  }

  public async insertarProducto(req: Request, resp: Response) {
    try {
      const { 
        nombre, 
        descripcion, 
        precio, 
        categoria, 
        imagen, 
        cantidad_stock, 
        estado_inventario, 
        rating 
      } = req.body;

      // Validaciones
      if (!nombre || !precio || !categoria) {
        return resp.status(400).json({
          message: "Nombre, precio y categoría son obligatorios",
          code: 400
        });
      }

      const nuevoProducto = {
        nombre,
        descripcion: descripcion || null,
        precio,
        categoria,
        imagen: imagen || null,
        cantidad_stock: cantidad_stock || 0,
        estado_inventario: estado_inventario || 'Disponible',
        rating: rating || null
      };

      const result = await pool.then(async (connection) => {
        return await connection.query('INSERT INTO productos SET ?', [nuevoProducto]);
      });

      resp.status(201).json({
        message: "Producto insertado exitosamente",
        code: 201,
        productoId: result.insertId,
      });
    } catch (error: any) {
      resp.status(500).json({
        message: `Error al insertar producto: ${error.message}`,
        code: 500
      });
    }
  }

  public async actualizarProducto(req: Request, resp: Response) {
    try {
      const { id } = req.params;
      console.log(id)
      const { 
        nombre, 
        descripcion, 
        precio, 
        categoria, 
        imagen, 
        cantidad_stock, 
        estado_inventario, 
        rating 
      } = req.body;

      // Verificar si el producto existe
      const existingProduct = await pool.then(async (connection) => {
        return await connection.query('SELECT * FROM productos WHERE id = ?', [id]);
      });

      if (existingProduct.length === 0) {
        return resp.status(404).json({
          message: "Producto no encontrado",
          code: 404
        });
      }

      // Preparar datos para actualización
      const updateData: any = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (precio !== undefined) updateData.precio = precio;
      if (categoria !== undefined) updateData.categoria = categoria;
      if (imagen !== undefined) updateData.imagen = imagen;
      if (cantidad_stock !== undefined) updateData.cantidad_stock = cantidad_stock;
      if (estado_inventario !== undefined) updateData.estado_inventario = estado_inventario;
      if (rating !== undefined) updateData.rating = rating;

      // Construir consulta dinámica
      const updateFields = Object.keys(updateData)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const updateValues = [...Object.values(updateData), id];

      // Ejecutar actualización
      await pool.then(async (connection) => {
        return await connection.query(
          `UPDATE productos SET ${updateFields} WHERE id = ?`,
          updateValues
        );
      });

      resp.status(200).json({
        message: "Producto actualizado exitosamente",
        code: 200
      });
    } catch (error: any) {
      resp.status(500).json({
        message: `Error al actualizar producto: ${error.message}`,
        code: 500
      });
    }
  }

  public async borrarProducto(req: Request, resp: Response) {
    try {
      const { id } = req.params;

      // Verificar si el producto existe
      const existingProduct = await pool.then(async (connection) => {
        return await connection.query('SELECT * FROM productos WHERE id = ?', [id]);
      });

      if (existingProduct.length === 0) {
        return resp.status(404).json({
          message: "Producto no encontrado",
          code: 404
        });
      }

      // Eliminar producto
      await pool.then(async (connection) => {
        return await connection.query('DELETE FROM productos WHERE id = ?', [id]);
      });

      resp.status(200).json({
        message: "Producto eliminado exitosamente",
        code: 200
      });
    } catch (error: any) {
      resp.status(500).json({
        message: `Error al eliminar producto: ${error.message}`,
        code: 500
      });
    }
  }
}

const productoController = new ProductoController();
export default productoController;