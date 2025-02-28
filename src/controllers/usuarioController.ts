import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModel";
import UsuarioModelo from "../models/usuarioModel";
import { utils } from "../utils/utils";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";


class UsuarioController {
  public async list(req: Request, res: Response) {
    try {
      return res.json({ message: "Listado de Usuario", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }


  public async add(req: Request, res: Response) {
    try {
      return res.json({ message: "Agregar Usuario", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }


  public async update(req: Request, res: Response) {
    try {
      return res.json({ message: "Modificación de Usuario", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }


  public async delete(req: Request, res: Response) {
    try {
      return res.json({ message: "Eliminación de Usuario", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }
}

export default new UsuarioController();