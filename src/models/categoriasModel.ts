import pool from '../utils/connection';

class CategoriaModelo {
    // Obtener todas las categorías
    public async list() {
        const result = await pool.then(async (connection) => {
            return await connection.query("SELECT id, nombre FROM tbl_categoria");
        });
        return result;
    }

    // Agregar una nueva categoría
    public async add(nombre: string) {
        const result = await pool.then(async (connection) => {
            return await connection.query(
                "INSERT INT categorias SET ?", [{ nombre }]
            );
        });
        return result.insertId;
    }

    // Actualizar una categoría existente
    public async update(id: number, nombre: string) {
        await pool.then(async (connection) => {
            await connection.query(
                "UPDATE categorias SET nombre = ? WHERE id = ?", [nombre, id]
            );
        });
    }

    // Eliminar una categoría
    public async delete(id: number) {
        await pool.then(async (connection) => {
            await connection.query("DELETE FROM categorias WHERE id = ?", [id]);
        });
    }
}

const model = new CategoriaModelo();
export default model;