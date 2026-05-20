import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; // Aluth eka

const app = express();

app.use(express.json()); 
app.use(cors()); 
app.use(helmet()); 
app.use(morgan('dev')); 

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/tasks', taskRoutes); // Mount kala

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SaaS CRM API App is running perfectly!' });
});

export default app;