// backend/src/server.js
import 'dotenv/config'; 
import app from './app.js';
import prisma from './config/prisma.js'; // Kalin hadapu prisma.js eka import karanawa

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database connection eka check karanawa server eka start wenna kalin
    await prisma.$connect();
    console.log('Database connection successful');

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();