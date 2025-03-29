import { Router } from "express";
import pedidoControllers from "../controllers/pedidosController";

class PedidoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    // Listar todos los pedidos
    this.router.get('/listar', pedidoControllers.listarPedidos);

    // Listar un pedido específico
    this.router.get('/listar/:id', pedidoControllers.listarUnPedido);

    // Crear un nuevo pedido
    this.router.post('/crear', pedidoControllers.crearPedido);

    // Actualizar el estado de un pedido
    this.router.put('/actualizar/:id', pedidoControllers.actualizarPedido);

    // Eliminar un pedido
    this.router.delete('/eliminar/:id', pedidoControllers.borrarPedido);

    // Listar pedidos por usuario
    this.router.get('/usuario/:usuario_id', pedidoControllers.listarPedidosPorUsuario);
  }
}

const pedidoRoutes = new PedidoRoutes();
export default pedidoRoutes.router;
