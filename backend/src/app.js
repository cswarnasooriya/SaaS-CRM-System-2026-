// backend/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes import karanawa
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js'; // Aluth route eka import kara

const app = express();

app.use(express.json()); 
app.use(cors()); 
app.use(helmet()); 
app.use(morgan('dev')); 

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes); // Aluth route eka mount kara

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SaaS CRM API App is running perfectly!' });
});

export default app;