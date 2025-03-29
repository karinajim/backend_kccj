import { Router } from "express";
import productoController from "../controllers/productosController";

class ProductoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/listar/:id', productoController.listarUnProducto);
    this.router.get('/listar', productoController.listarProducto);
    this.router.post('/insertar', productoController.insertarProducto);
    this.router.put('/modificar/:id', productoController.actualizarProducto);
    this.router.delete('/eliminar/:id', productoController.borrarProducto);
  }
}

const productoRoutes = new ProductoRoutes();
export default productoRoutes.router;
