import pool from '../utils/connection'; 

class UsuarioModelo {
    createUser(name: any, email: any, password: any, role: any) {
        throw new Error("Method not implemented.");
    }
    getUserByEmail(email: any) {
        throw new Error("Method not implemented.");
    }
  public async getByEmail(email: string) {
    try {
      const [user] = await pool.then(async (connection) => {
        const consulta = "SELECT * FROM tbl_usuario WHERE email ='"+email+"'"
        return await connection.query(consulta);
      });
      console.log(user)
     
      return user; // Si no existe el usuario, retornamos null
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  public async list() {
    try {
      const users = await pool.then(async (connection) => {
        return await connection.query("SELECT * FROM tbl_usuario");
      });
      return users
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }


  
    // Método para agregar un nuevo usuario
    public async add(usuario: { email: string; password: string; role: string }) {
      try {
        // Verificar si ya existe un usuario con el mismo email
        const [existingUser] = await pool.then(async (connection) => {
          return await connection.query("SELECT * FROM tbl_usuario WHERE email =?", [usuario.email]);
        });
  
        if (existingUser.length > 0) {
          throw new Error('Ya existe un usuario con el mismo correo electrónico.');
        }
  
        // Si no existe, insertar el nuevo usuario
        const result = await pool.then(async (connection) => {
          return await connection.query("INSERT INTO tbl_usuario SET ?", [usuario]);
        });
        return result;
      } catch (error) {
        throw new Error(`Error al agregar usuario: ${error.message}`);
      }
    }
  
    // Método para actualizar un usuario
    public async update(usuario: { email: string; password: string }) {
      try {
        // Verificar si el usuario existe
        const [existingUser] = await pool.then(async (connection) => {
          return await connection.query("SELECT * FROM tbl_usuario WHERE email = ?", [usuario.email]);
        });
  
        if (existingUser.length === 0) {
          throw new Error('El usuario con el correo electrónico no existe.');
        }
  
        // Actualizar el usuario
        const result = await pool.then(async (connection) => {
          return await connection.query(
            "UPDATE tbl_usuario SET password = ? WHERE email = ?",
            [usuario.password, usuario.email]
          );
        });
        return result;
      } catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
      }
    }
  
    // Método para eliminar un usuario
    public async delete(email: string) {
      try {
        // Verificar si el usuario existe
        const [existingUser] = await pool.then(async (connection) => {
          return await connection.query("SELECT * FROM tbl_usuario WHERE email = ?", [email]);
        });
  
        if (existingUser.length === 0) {
          throw new Error('El usuario con el correo electrónico no existe.');
        }
  
        // Eliminar el usuario
        const result = await pool.then(async (connection) => {
          return await connection.query("DELETE FROM tbl_usuario WHERE email = ?", [email]);
        });
        return result;
      } catch (error) {
        throw new Error(`Error al eliminar usuario: ${error.message}`);
      }
    }
  }
  
  const model = new UsuarioModelo();
  export default model;