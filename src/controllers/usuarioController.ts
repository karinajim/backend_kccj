import { Request, Response } from "express";
import validator from "validator";
<<<<<<< HEAD
import model from "../models/usuarioModelo";
=======
import model from "../models/usuarioModel";
import UsuarioModelo from "../models/usuarioModel";
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
import { utils } from "../utils/utils";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import pool from "../utils/connection";

<<<<<<< HEAD
=======

>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
class UsuarioController {
  
  public async list(req: Request, res: Response) {
    try {
<<<<<<< HEAD
      const usuarios = await pool.then(async (connection) => {
        return await connection.query("SELECT id, nombre_completo, email, rol FROM usuarios");
      });
      
      return res.json({
        message: "Listado de Usuarios",
=======
      const usuarios = await model.list();
      return res.json({
        message: "Listado de Usuario",
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
        usuarios: usuarios,
        code: 200,
      });
    } catch (error: any) {
<<<<<<< HEAD
      return res.status(500).json({ 
        message: `Error al listar usuarios: ${error.message}`,
        code: 500 
      });
    }
  }

  public async getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.query.email;
      
      const users = await pool.then(async (connection) => {
        return await connection.query(
          "SELECT id, nombre_completo, email, rol, fecha_registro FROM usuarios WHERE email = ?", 
          [email]
        );
      });

      if (users.length === 0) {
        return res.json({
          message: "Email no existe",
          usuario: null,
          code: 404,
        });
      }

      return res.json({
        message: "Usuario encontrado",
        usuario: users[0],
        code: 200,
      });
    } catch (error: any) {
      return res.status(500).json({ 
        message: `Error al buscar usuario: ${error.message}`,
        code: 500 
      });
    }
  }

  public async add(req: Request, res: Response) {
    try {
      const { nombre_completo, email, password, rol } = req.body;

      // Validaciones básicas
      if (!nombre_completo || !email || !password) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios",
          code: 400
        });
      }

      // Verificar si el email ya existe
      const existingUsers = await pool.then(async (connection) => {
        return await connection.query(
          "SELECT id FROM usuarios WHERE email = ?", 
          [email]
        );
      });

      if (existingUsers.length > 0) {
        return res.status(409).json({
          message: "El email ya está registrado",
          code: 409
        });
      }

      // Encriptar la contraseña
      const encryptedPassword = await utils.hashPassword(password);

      // Insertar nuevo usuario
      const result = await pool.then(async (connection) => {
        return await connection.query(
          "INSERT INTO usuarios (nombre_completo, email, password, rol) VALUES (?, ?, ?, ?)",
          [nombre_completo, email, encryptedPassword, rol || 'usuario']
        );
      });

      return res.status(201).json({
        message: "Usuario Agregado Exitosamente",
        code: 201,
        usuarioId: result.insertId
      });
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({ 
        message: `Error al crear usuario: ${error.message}`,
        code: 500 
      });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { email, password, nombre_completo, rol } = req.body;

      // Validaciones
      if (!email) {
        return res.status(400).json({
          message: "El email es obligatorio para actualizar",
          code: 400
        });
      }

      // Preparar datos para actualización
      const updateData: any = { };
      
      // Si se proporciona contraseña, encriptarla
      if (password) {
        updateData.password = await utils.hashPassword(password);
      }

      // Construir consulta dinámica
      const updateFields = Object.keys(updateData)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const updateValues = [...Object.values(updateData), email];

      // Ejecutar actualización
      const result = await pool.then(async (connection) => {
        return await connection.query(
          `UPDATE usuarios SET ${updateFields} WHERE email = ?`,
          updateValues
        );
      });

      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Usuario no encontrado",
          code: 404
        });
      }

      return res.json({
        message: "Usuario Modificado con Éxito",
        code: 200
      });
    } catch (error: any) {
      console.error("Error al Actualizar usuario:", error);
      return res.status(500).json({ 
        message: `Error al actualizar usuario: ${error.message}`,
        code: 500 
      });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "El email es obligatorio para eliminar un usuario",
          code: 400
        });
      }

      const result = await pool.then(async (connection) => {
        return await connection.query(
          "DELETE FROM usuarios WHERE email = ?",
          [email]
        );
      });

      // Verificar si se eliminó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Usuario no encontrado",
          code: 404
        });
      }

      return res.json({
        message: "Usuario Eliminado con Éxito",
        code: 200
      });
    } catch (error: any) { 
      return res.status(500).json({ 
        message: `Error al eliminar usuario: ${error.message}`,
        code: 500 
      });
    }
=======
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

>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
  }
}

export default new UsuarioController();