import express from 'express';
import { 
  getCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  getCustomerById, 
  addNote
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCustomers)
  .post(createCustomer);

router.route('/:id')
  .get(getCustomerById) 
  .put(updateCustomer)
  .delete(deleteCustomer);

router.route('/:id/notes')
  .post(addNote); 

export default router;