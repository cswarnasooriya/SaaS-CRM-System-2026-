// backend/src/routes/authRoutes.js
import express from 'express';
// protect middleware ekai getMe controller ekai import karaganna
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// getMe endpoint eka call karanna kalin 'protect' middleware eka run wenawa
router.get('/me', protect, getMe); 

export default router;