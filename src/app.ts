import express, { Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

// Importación de las rutas
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productosRoutes';
import orderRoutes from './routes/orderRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import dotenv from 'dotenv';
import pedidosRoutes from './routes/pedidosRoutes';
import carritoRoutes from './routes/carritoRoutes';
import categoriasRouter from './routes/categoriasRouter';

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
