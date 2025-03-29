import { Request, Response } from "express";
import pool from "../utils/connection";

class PedidoController {
  // Listar todos los pedidos con sus detalles
  public async listarPedidos(req: Request, resp: Response) {
    try {
      const pedidos = await pool.then(async (connection) => {
        return await connection.query(`
          SELECT 
            p.id, 
            p.usuario_id, 
            u.nombre_completo AS usuario_nombre,
            p.fecha_pedido, 
            p.total, 
            p.estado,
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'producto_id', dp.producto_id,
                  'nombre_producto', pr.nombre,
                  'cantidad', dp.cantidad,
                  'precio_unitario', dp.precio_unitario,
                  'subtotal', dp.subtotal
                )
              )
              FROM detalle_pedidos dp
              JOIN productos pr ON dp.producto_id = pr.id
              WHERE dp.pedido_id = p.id
            ) AS detalles
          FROM pedidos p
          JOIN usuarios u ON p.usuario_id = u.id
          ORDER BY p.fecha_pedido DESC
        `);
      });

      resp.status(200).json({
        message: "Listado de Pedidos",
        pedidos: pedidos,
        total: pedidos.length
      });
    } catch (error: any) {
      resp.status(500).json({ 
        message: `Error al listar pedidos: ${error.message}`,
        code: 500 
      });
    }
  }

  // Listar un pedido específico con sus detalles
  public async listarUnPedido(req: Request, resp: Response) {
    try {
      const { id } = req.params;

      const pedido = await pool.then(async (connection) => {
        return await connection.query(`
          SELECT 
            p.id, 
            p.usuario_id, 
            u.nombre_completo AS usuario_nombre,
            p.fecha_pedido, 
            p.total, 
            p.estado,
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'producto_id', dp.producto_id,
                  'nombre_producto', pr.nombre,
                  'cantidad', dp.cantidad,
                  'precio_unitario', dp.precio_unitario,
                  'subtotal', dp.subtotal
                )
              )
              FROM detalle_pedidos dp
              JOIN productos pr ON dp.producto_id = pr.id
              WHERE dp.pedido_id = p.id
            ) AS detalles
          FROM pedidos p
          JOIN usuarios u ON p.usuario_id = u.id
          WHERE p.id = ?
        `, [id]);
      });

      if (pedido.length === 0) {
        return resp.status(404).json({
          message: "Pedido no encontrado",
          code: 404
        });
      }

      resp.status(200).json({
        message: "Pedido encontrado",
        pedido: pedido[0]
      });
    } catch (error: any) {
      resp.status(500).json({ 
        message: `Error al buscar pedido: ${error.message}`,
        code: 500 
      });
    }
  }

  public async crearPedido(req: Request, resp: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
        const { usuario_id, detalles } = req.body;

        // Validaciones
        if (!usuario_id || !detalles || detalles.length === 0) {
            return resp.status(400).json({
                message: "Datos de pedido incompletos",
                code: 400
            });
        }

        // Obtener precios de los productos desde la base de datos
        const detallesConPrecios = [];
        for (const detalle of detalles) {
            const producto = await connection.query(
                'SELECT precio FROM productos WHERE id = ?',
                [detalle.producto_id]
            );

            if (producto.length === 0) {
                return resp.status(404).json({
                    message: `Producto con ID ${detalle.producto_id} no encontrado`,
                    code: 404
                });
            }

            const precio_unitario = producto[0].precio;
            const subtotal = detalle.cantidad * precio_unitario;

            detallesConPrecios.push({
                producto_id: detalle.producto_id,
                cantidad: detalle.cantidad,
                precio_unitario,
                subtotal
            });
        }

        // Calcular el total del pedido
        const total = detallesConPrecios.reduce((sum, item) => sum + item.subtotal, 0);

        // Insertar pedido
        const pedidoResult = await connection.query(
            'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)',
            [usuario_id, total, 'Pendiente']
        );

        const pedidoId = pedidoResult.insertId;

        // Insertar detalles del pedido
        const detallesPedido = detallesConPrecios.map((detalle) => [
            pedidoId,
            detalle.producto_id,
            detalle.cantidad,
            detalle.precio_unitario,
            detalle.subtotal
        ]);

        await connection.query(
            'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?',
            [detallesPedido]
        );

        // Actualizar stock de productos
        for (const detalle of detalles) {
            await connection.query(
                'UPDATE productos SET cantidad_stock = cantidad_stock - ? WHERE id = ?',
                [detalle.cantidad, detalle.producto_id]
            );
        }

        await connection.commit();

        resp.status(201).json({
            message: "Pedido creado exitosamente",
            code: 201,
            pedidoId: pedidoId
        });
    } catch (error: any) {
        await connection.rollback();
        resp.status(500).json({
            message: `Error al crear pedido: ${error.message}`,
            code: 500
        });
    }
}

  // Actualizar estado de un pedido
  public async actualizarPedido(req: Request, resp: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      // Validaciones
      if (!estado) {
        return resp.status(400).json({
          message: "El estado es obligatorio",
          code: 400
        });
      }

      // Verificar si el pedido existe
      const existingPedido = await pool.then(async (connection) => {
        return await connection.query('SELECT * FROM pedidos WHERE id = ?', [id]);
      });

      if (existingPedido.length === 0) {
        return resp.status(404).json({
          message: "Pedido no encontrado",
          code: 404
        });
      }

      // Actualizar estado
      await pool.then(async (connection) => {
        return await connection.query(
          'UPDATE pedidos SET estado = ? WHERE id = ?',
          [estado, id]
        );
      });

      resp.status(200).json({
        message: "Estado del pedido actualizado exitosamente",
        code: 200
      });
    } catch (error: any) {
      resp.status(500).json({ 
        message: `Error al actualizar pedido: ${error.message}`,
        code: 500 
      });
    }
  }

  // Eliminar un pedido
  public async borrarPedido(req: Request, resp: Response) {
    const connection = await pool.then(conn => conn.getConnection());
    await connection.beginTransaction();

    try {
      const { id } = req.params;

      // Verificar si el pedido existe
      const existingPedido = await connection.query(
        'SELECT * FROM pedidos WHERE id = ?', 
        [id]
      );

      if (existingPedido.length === 0) {
        return resp.status(404).json({
          message: "Pedido no encontrado",
          code: 404
        });
      }

      // Eliminar detalles del pedido
      await connection.query(
        'DELETE FROM detalle_pedidos WHERE pedido_id = ?', 
        [id]
      );

      // Eliminar pedido
      await connection.query(
        'DELETE FROM pedidos WHERE id = ?', 
        [id]
      );

      await connection.commit();

      resp.status(200).json({
        message: "Pedido eliminado exitosamente",
        code: 200
      });
    } catch (error: any) {
      await connection.rollback();
      resp.status(500).json({ 
        message: `Error al eliminar pedido: ${error.message}`,
        code: 500 
      });
    }
  }

  // Listar pedidos por usuario
  public async listarPedidosPorUsuario(req: Request, resp: Response) {
    try {
      const { usuario_id } = req.params;

      const pedidos = await pool.then(async (connection) => {
        return await connection.query(`
          SELECT 
            p.id, 
            p.fecha_pedido, 
            p.total, 
            p.estado,
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'producto_id', dp.producto_id,
                  'nombre_producto', pr.nombre,
                  'cantidad', dp.cantidad,
                  'precio_unitario', dp.precio_unitario,
                  'subtotal', dp.subtotal
                )
              )
              FROM detalle_pedidos dp
              JOIN productos pr ON dp.producto_id = pr.id
              WHERE dp.pedido_id = p.id
            ) AS detalles
          FROM pedidos p
          WHERE p.usuario_id = ?
          ORDER BY p.fecha_pedido DESC
        `, [usuario_id]);
      });

      resp.status(200).json({
        message: "Pedidos del usuario",
        pedidos: pedidos,
        total: pedidos.length
      });
    } catch (error: any) {
      resp.status(500).json({ 
        message: `Error al listar pedidos del usuario: ${error.message}`,
        code: 500 
      });
    }
  }
}

const pedidoController = new PedidoController();
export default pedidoController;