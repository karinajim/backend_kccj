import express, { Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

// Importación de las rutas
import authRoutes from './routes/authRoutes';
<<<<<<< HEAD
import productRoutes from './routes/productosRoutes';
import orderRoutes from './routes/orderRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import dotenv from 'dotenv';
import pedidosRoutes from './routes/pedidosRoutes';
import carritoRoutes from './routes/carritoRoutes';
import categoriasRouter from './routes/categoriasRouter';
=======
import usuarioRoutes from './routes/usuarioRoutes';
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4

dotenv.config();
const port = process.env.PORT || 3000;

// Inicialización de la aplicación
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rutas
app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('api/categorias', categoriasRouter);

// Inicio del servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
<<<<<<< HEAD
=======
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
    this.app.use("/auth", authRoutes);
    this.app.use("/usuario", usuarioRoutes);
  }
}
const server = new Server();
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
