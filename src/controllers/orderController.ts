import { Request, Response } from "express";
import model from "../models/orderModel";

class OrderController {
    public async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await model.getAllOrders();
            return res.json(orders);
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }


    public async createOrder(req: Request, res: Response) {
        try {
            const { user_id, products, total } = req.body;
            await model.createOrder(user_id, products, total);
            return res.json({ message: "Pedido creado correctamente" });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async updateOrderStatus(req: Request, res: Response) {
        try {
            const { id, status } = req.body;
            await model.updateOrderStatus(id, status);
            return res.json({ message: "Estado de pedido actualizado" });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async getOrdersByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            const orders = await model.getOrdersByUserId(Number(user_id));
            return res.json(orders);
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }
}

export const orderController = new OrderController();
