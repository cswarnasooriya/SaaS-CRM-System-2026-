// backend/src/routes/invoiceRoutes.js
import express from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Okkoma invoice routes protect karanawa (token eka aniwaryai)
router.use(protect); 

router.route('/')
  .post(createInvoice)
  .get(getInvoices);

router.route('/:id')
  .get(getInvoiceById)
  .delete(deleteInvoice);

router.route('/:id/status')
  .patch(updateInvoiceStatus);

export default router;