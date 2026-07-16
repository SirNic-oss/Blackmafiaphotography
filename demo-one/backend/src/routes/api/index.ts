import express from 'express';
import authRoutes from './auth.routes';
import cartRoutes from './cart.routes';
import productRoutes from '../product.routes'; // Adjust path since it's one level up

const app = express();

// Use JSON middleware if needed
app.use(express.json());

// Mount the routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes); // Mount product route from the top level

export default app;