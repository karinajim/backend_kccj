import pool from '../utils/connection';

class OrderModel {
    public async createOrder(user_id: number, products: string, total: number) {
        const query = "INSERT INTO orders (user_id, products, total, status) VALUES (?, ?, ?, 'pending')";
        const result = await pool.then(async (connection) => {
            return await connection.query(query, [user_id, products, total]);
        });
        return result;
    }

    public async getOrdersByUserId(user_id: number) {
        const query = "SELECT * FROM orders WHERE user_id = ?";
        const result = await pool.then(async (connection) => {
            return await connection.query(query, [user_id]);
        });
        return result;
    }

    public async getAllOrders() {
        const query = "SELECT * FROM orders";
        const result = await pool.then(async (connection) => {
            return await connection.query(query);
        });
        return result;
    }

    public async updateOrderStatus(id: number, status: string) {
        const query = "UPDATE orders SET status = ? WHERE id = ?";
        const result = await pool.then(async (connection) => {
            return await connection.query(query, [status, id]);
        });
        return result;
    }
}

const model = new OrderModel();
export default model;
