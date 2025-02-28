import { Request, Response } from "express";
import validator from "validator";
import model from "../models/authModelo";

class AuthController {
    public async iniciarSesion(req: Request, res: Response) {
        try {
            
            const { email, password } = req.body;
       
            // Verificar si email o password están ausentes o vacíos
            if (!email || !password || validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())) {
                return res.status(400).json({ message: "Los campos son requeridos", code: 1 });
            }

            // Buscar el usuario en la base de datos
            const lstUsers = await model.getuserByEmail(email);
            console.log(lstUsers)


            if (lstUsers.length <= 0) {
                return res.status(404).json({ message: "El usuario y/o contraseña es incorrecto", code: 1 });
            }

            return res.json({ message: "Autenticación correcta", code: 0 });

        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async saludar(req: Request, res: Response) {
        return res.json({
            Mensaje: "Hola Karina Carrillo"
        });
    }
}

export const authController = new AuthController();
