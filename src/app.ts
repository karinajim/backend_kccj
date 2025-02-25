import express from 'express';
import { Application } from 'express';
import { Producto } from './models/producto';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();
 
/*  DotEnv  */
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
 
app.get('/productos', (req, res) => {
  console.log("Lista de productos:", productos); // Imprime en consola
  res.json(productos); // Envía los productos en formato JSON
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
const productos: Producto[] = [
  {nombre: "Laptop", descripcion: "bonito", precio: 15000, cantidad: 5 },
  {nombre: "Mouse", descripcion: "bonito", precio: 500, cantidad: 20 },
  {nombre: "Teclado", descripcion: "bonito", precio: 800, cantidad: 15 }
];

class Server {
  private app: Application;

  //Inicializa clase
  constructor(){
    this.app = express();
    this.config();
    this.routes();
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
  });
  }

  //Configuración de módulos
  config(): void {
      // configuración del puerto para el servidor
      this.app.set("port", 4000);
     
      // muestra las peticiones en consola
      this.app.use(morgan("dev"));
 
      // puertos de conexión de la API
      this.app.use(cors());
 
      // solo se permiten peticiones en formato JSON
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({extended: false,}));
  }

  //Configura las rutas
  routes(){
    this.app.use("/", authRoutes);
  }
}
const server = new Server();
