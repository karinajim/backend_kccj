import { Router } from "express";
import carritoController from "../controllers/carritoController";

class CarritoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/agregar', carritoController.agregarAlCarrito);
    this.router.get('/:usuario_id', carritoController.obtenerCarrito);
    this.router.put('/actualizar/:carrito_id', carritoController.actualizarCantidad);
    this.router.delete('/eliminar/:carrito_id', carritoController.eliminarDelCarrito);
    this.router.delete('/vaciar/:usuario_id', carritoController.vaciarCarrito);
    this.router.post('/convertir', carritoController.convertirCarritoEnPedido);
  }
}

const carritoRoutes = new CarritoRoutes();
export default carritoRoutes.router;
