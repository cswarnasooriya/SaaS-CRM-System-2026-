// backend/src/routes/customerRoutes.js
import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Okkoma routes walata protect middleware eka apply karanawa
router.use(protect); 

// Routes define kirima
router.route('/')
  .post(createCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

export default router;