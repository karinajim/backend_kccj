import { Router } from "express";
import usuarioController from "../controllers/usuarioController"; 



class UsuarioRoutes {


    public router: Router;


    constructor() {
        this.router = Router();
        this.config();
    }


    private config() {  
<<<<<<< HEAD
        this.router.get('/', usuarioController.list);   
        this.router.get('/email', usuarioController.getUserByEmail);             
=======
        this.router.get('/', usuarioController.list);             
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
        this.router.post('/', usuarioController.add)
        this.router.put('/', usuarioController.update)
        this.router.delete('/', usuarioController.delete)
    }
}
const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;
