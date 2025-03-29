import { Request, Response } from 'express';
import pool from '../utils/connection';

class CarritoController {
  // Agregar producto al carrito
  public async agregarAlCarrito(req: Request, res: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
      const { usuario_id, producto_id, cantidad } = req.body;

      // Validaciones iniciales
      if (!usuario_id || !producto_id || !cantidad) {
        return res.status(400).json({
          message: "Datos incompletos para agregar al carrito",
          code: 400
        });
      }

      // Verificar existencia del producto
      const [producto] = await connection.query(
        'SELECT id, cantidad_stock, precio, estado_inventario FROM productos WHERE id = ?', 
        [producto_id]
      );

      if (!producto) {
        return res.status(404).json({
          message: `Producto con ID ${producto_id} no encontrado`,
          code: 404
        });
      }

      // Validar stock disponible
      if (producto.estado_inventario === 'Agotado' || producto.cantidad_stock < cantidad) {
        return res.status(400).json({
          message: "Cantidad supera el stock disponible",
          code: 400
        });
      }

      // Verificar si el producto ya está en el carrito del usuario
      const [carritoExistente] = await connection.query(
        'SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?',
        [usuario_id, producto_id]
      );

      let resultado;
      if (carritoExistente) {
        // Si ya existe, actualizar cantidad
        const nuevaCantidad = carritoExistente.cantidad + cantidad;
        
        if (nuevaCantidad > producto.cantidad_stock) {
          return res.status(400).json({
            message: "La cantidad total supera el stock disponible",
            code: 400
          });
        }

        resultado = await connection.query(
          'UPDATE carrito SET cantidad = ?, fecha_agregado = CURRENT_TIMESTAMP WHERE id = ?',
          [nuevaCantidad, carritoExistente.id]
        );
      } else {
        // Insertar nuevo producto en el carrito
        resultado = await connection.query(
          'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [usuario_id, producto_id, cantidad]
        );
      }

      await connection.commit();

      res.status(201).json({
        message: "Producto agregado al carrito exitosamente",
        code: 201,
        carritoId: resultado.insertId || carritoExistente.id
      });
    } catch (error: any) {
      await connection.rollback();
      res.status(500).json({
        message: `Error al agregar producto al carrito: ${error.message}`,
        code: 500
      });
    } finally {
      connection.release();
    }
  }

  // Obtener carrito de un usuario
  public async obtenerCarrito(req: Request, res: Response) {
    try {
      const { usuario_id } = req.params;

      const carrito = await pool.then(async (connection) => {
        return await connection.query(`
          SELECT 
            c.id AS carrito_id, 
            c.cantidad,
            c.fecha_agregado,
            p.id AS producto_id,
            p.nombre,
            p.precio,
            p.imagen,
            p.cantidad_stock,
            (c.cantidad * p.precio) AS subtotal
          FROM carrito c
          JOIN productos p ON c.producto_id = p.id
          WHERE c.usuario_id = ?
          ORDER BY c.fecha_agregado DESC
        `, [usuario_id]);
      });

      const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

      res.status(200).json({
        message: "Carrito del usuario",
        carrito: carrito,
        total: total,
        totalItems: carrito.length
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: `Error al obtener carrito: ${error.message}`,
        code: 500 
      });
    }
  }

  // Actualizar cantidad de un producto en el carrito
  public async actualizarCantidad(req: Request, res: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
      const { carrito_id } = req.params;
      const { cantidad } = req.body;

      // Validaciones
      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
          message: "Cantidad inválida",
          code: 400
        });
      }

      // Obtener detalles del carrito y producto
      const [carritoItem] = await connection.query(`
        SELECT 
          c.id, 
          c.usuario_id, 
          c.producto_id, 
          c.cantidad AS cantidad_actual,
          p.cantidad_stock,
          p.estado_inventario
        FROM carrito c
        JOIN productos p ON c.producto_id = p.id
        WHERE c.id = ?
      `, [carrito_id]);

      if (!carritoItem) {
        return res.status(404).json({
          message: "Producto en carrito no encontrado",
          code: 404
        });
      }

      // Verificar stock disponible
      if (carritoItem.estado_inventario === 'Agotado' || cantidad > carritoItem.cantidad_stock) {
        return res.status(400).json({
          message: "Cantidad supera el stock disponible",
          code: 400
        });
      }

      // Actualizar cantidad
      await connection.query(
        'UPDATE carrito SET cantidad = ?, fecha_agregado = CURRENT_TIMESTAMP WHERE id = ?',
        [cantidad, carrito_id]
      );

      await connection.commit();

      res.status(200).json({
        message: "Cantidad actualizada exitosamente",
        code: 200
      });
    } catch (error: any) {
      await connection.rollback();
      res.status(500).json({ 
        message: `Error al actualizar cantidad: ${error.message}`,
        code: 500 
      });
    } finally {
      connection.release();
    }
  }

  // Eliminar producto del carrito
  public async eliminarDelCarrito(req: Request, res: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
      const { carrito_id } = req.params;

      // Verificar existencia del item en el carrito
      const [carritoItem] = await connection.query(
        'SELECT * FROM carrito WHERE id = ?', 
        [carrito_id]
      );

      if (!carritoItem) {
        return res.status(404).json({
          message: "Producto en carrito no encontrado",
          code: 404
        });
      }

      // Eliminar producto del carrito
      await connection.query(
        'DELETE FROM carrito WHERE id = ?', 
        [carrito_id]
      );

      await connection.commit();

      res.status(200).json({
        message: "Producto eliminado del carrito exitosamente",
        code: 200
      });
    } catch (error: any) {
      await connection.rollback();
      res.status(500).json({ 
        message: `Error al eliminar producto del carrito: ${error.message}`,
        code: 500 
      });
    } finally {
      connection.release();
    }
  }

  // Vaciar carrito de un usuario
  public async vaciarCarrito(req: Request, res: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
      const { usuario_id } = req.params;

      // Verificar si el carrito tiene items
      const carritoItems = await connection.query(
        'SELECT * FROM carrito WHERE usuario_id = ?', 
        [usuario_id]
      );

      if (carritoItems.length === 0) {
        return res.status(404).json({
          message: "Carrito ya está vacío",
          code: 404
        });
      }

      // Eliminar todos los productos del carrito para este usuario
      await connection.query(
        'DELETE FROM carrito WHERE usuario_id = ?', 
        [usuario_id]
      );

      await connection.commit();

      res.status(200).json({
        message: "Carrito vaciado exitosamente",
        code: 200
      });
    } catch (error: any) {
      await connection.rollback();
      res.status(500).json({ 
        message: `Error al vaciar carrito: ${error.message}`,
        code: 500 
      });
    } finally {
      connection.release();
    }
  }

  // Convertir carrito en pedido
  public async convertirCarritoEnPedido(req: Request, res: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
      const { usuario_id } = req.body;

      // Obtener items del carrito
      const carrito = await connection.query(`
        SELECT 
          c.producto_id, 
          c.cantidad, 
          p.precio 
        FROM carrito c
        JOIN productos p ON c.producto_id = p.id
        WHERE c.usuario_id = ?
      `, [usuario_id]);

      if (carrito.length === 0) {
        return res.status(400).json({
          message: "Carrito vacío, no se puede generar pedido",
          code: 400
        });
      }

      // Calcular total del pedido
      const total = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);

      // Crear pedido
      const pedidoResult = await connection.query(
        'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
        [usuario_id, total]
      );
      const pedidoId = pedidoResult.insertId;

      // Crear detalles de pedido
      const detallesPedido = carrito.map(item => [
        pedidoId, 
        item.producto_id, 
        item.cantidad, 
        item.precio, 
        item.cantidad * item.precio
      ]);

      await connection.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?',
        [detallesPedido]
      );

      // Actualizar stock de productos
      for (const item of carrito) {
        await connection.query(
          'UPDATE productos SET cantidad_stock = cantidad_stock - ? WHERE id = ?',
          [item.cantidad, item.producto_id]
        );
      }

      // Vaciar carrito
      await connection.query(
        'DELETE FROM carrito WHERE usuario_id = ?',
        [usuario_id]
      );

      await connection.commit();

      res.status(201).json({
        message: "Pedido generado exitosamente",
        code: 201,
        pedidoId: pedidoId
      });
    } catch (error: any) {
      await connection.rollback();
      res.status(500).json({
        message: `Error al convertir carrito en pedido: ${error.message}`,
        code: 500
      });
    } finally {
      connection.release();
    }
  }
}

const carritoController = new CarritoController();
export default carritoController;