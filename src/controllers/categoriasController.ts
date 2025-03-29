import { Request, Response } from 'express';
import model from '../models/categoriasModel';
import pool from "../utils/connection";


class CategoriasController {
    // Obtener todas las categorías
    public async list(req: Request, res: Response) {
        try {
            const categorias = await model.list();
            return res.json({
                message: "Listado de Categorías",
                Categorias: categorias,
                code: 200,
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });

        }
    }

    // Agregar una nueva categoría
    public async add(req: Request, res: Response) {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: "El campo 'nombre' es obligatorio" });
        }

        try {
            const categoria_id = await model.add(nombre);
            return res.json({
                message: "Categoría agregada correctamente",
                categoria_id,
                code: 200,
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });

        }
    }

    // Actualizar una categoría existente
    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!id || !nombre) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        try {
            await model.update(parseInt(id), nombre);
            return res.json({ message: "Categoría actualizada correctamente", code: 200 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });

        }
    }

    // Eliminar una categoría
    public async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Falta el ID de la categoría" });
        }

        try {
            await model.delete(parseInt(id));
            return res.json({ message: "Categoría eliminada correctamente", code: 200 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });

        }
    }

}
export const categoriasController = new CategoriasController();