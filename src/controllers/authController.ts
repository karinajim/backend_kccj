import { Request, Response } from "express";
import validator from "validator";
import model from "../models/authModelo";
import jwt from 'jsonwebtoken';
//import db from '../utils/utils';
import { utils } from "../utils/utils";

 
class AuthController {
   
    public async iniciarSesion(req: Request, res: Response) {

        try {
            console.log(req)
            const {email, password }= req.body;

            //verificar
            if(validator.isEmpty(email.trim())  ||
            validator.isEmpty(password.trim())){
                return res
                .status(400)
                .json({ message: "Los campos son requeridos", code: 1 });

            }

            const lstUsers = await model.getuserByEmail(email);
            if (lstUsers.length <= 0) {
            return res.status(404).json({ message: "El usuario y/o contraseña es incorrecto", code: 1 });
            }

            let result = utils.checkPassword(password, lstUsers[0].password);

            result.then((value)=>{
                if(value){
                    const newUser={
                        email: lstUsers[0].email,
                        password: lstUsers[0].password,
                        role:   lstUsers[0].role
                    }

                    console.log(process.env.SECRET)
                    const env= require('dotenv').config();
                    let token = jwt.sign(newUser, process.env.SECRET, {expiresIn:'1h'})

                    return res.json({ message: "Autenticación correcta", token, code: 0 });
                }else{
                    return res.json({ message: "Password incorrecta", code: 1 });

                }
            })
          
        } catch (error) {
            return res.status(500).json({ message : `${error.message}` });
        }
       
    } 
            

    public async saludar(req: Request, res: Response){
        const {nombre, edad, correo} = req.query;
        return res.json({ message : "Autenticación correcta",
            correo: correo,
            nombre: nombre,
            edad: edad });
    }
        
 
}
export const authController = new AuthController();
