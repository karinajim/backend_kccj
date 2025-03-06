import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModel";
import UsuarioModelo from "../models/usuarioModel";
import { utils } from "../utils/utils";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import pool from "../utils/connection";


class UsuarioController {
  
  public async list(req: Request, res: Response) {
    try {
      const usuarios = await model.list();
      return res.json({
        message: "Listado de Usuario",
        usuarios: usuarios,
        code: 200,
      });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }

  }


  public async add(req: Request, res: Response) {
    try {
      const usuario = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };

          //Encriptar la contraseña
      var encryptedText = await utils.hashPassword(usuario.password);
      usuario.password = encryptedText;

      const result = await pool.then(async (connection) => {
        return await connection.query(" INSERT INTO tbl_usuario SET ? ", [
          usuario,
        ]);
      });
      console.log(result);
      return res.json({
        message: "Usuario Agregado",
        code: 200,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.json({ code: error.code, message: error.message });
    }

  }


  public async update(req: Request, res: Response) {
    try {
      const usuario = req.body;

      //Encriptar la contraseña
      var encryptedText = await utils.hashPassword(usuario.password);
      usuario.password = encryptedText;

      const update =
        "UPDATE tbl_usuario SET password='" +
        usuario.password +
        "' where email='" +
        usuario.email +
        "'";
      const result = await pool.then(async (connection) => {
        return await connection.query(update);
      });
      return res.json({
        message: "Usuario Modificado con Exito",
        code: 200,
      });
    } catch (error) {
      console.error("Error al Actualizar un usuario:", error);
      return res.json({ code: error.code, message: error.message });
    }


  }


  public async delete(req: Request, res: Response) {
    try {
      console.log("Eliminando");
      const email = req.body.email;
      const result = await pool.then(async (connection) => {
        return await connection.query(
          "DELETE FROM tbl_usuario where email= ?",
          [email]
        );
      });
      return res.json({
        message: "Usuario Eliminado con Exito",
        code: 200,
      });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }

  }
}

export default new UsuarioController();