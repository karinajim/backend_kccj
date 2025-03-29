import { Router } from 'express';
import { orderController } from '../controllers/orderController';

const router = Router();

router.get('/', orderController.getAllOrders); //Adm
router.post('/', orderController.createOrder); //Usuarios
router.put('/', orderController.updateOrderStatus); //Adm
router.get('/:user_id', orderController.getOrdersByUser); //Adm

export default router;
