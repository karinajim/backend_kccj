import { Router } from 'express';
import { categoriasController } from "../controllers/categoriasController";


class CategoriaRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    private config() {
        this.router.get('/', categoriasController.list); // Listar todas las categorías
        this.router.post('/agregar', categoriasController.add); // Agregar una nueva categoría
        this.router.put('/actualizar/:id', categoriasController.update); // Actualizar una categoría
        this.router.delete('/eliminar/:id', categoriasController.delete); // Eliminar una categoría
    }
}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;
