import express from 'express';
import { getTeam, addTeamMember } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All team routes require authentication
router.use(protect);

router.route('/')
  .get(getTeam)
  .post(addTeamMember);

export default router;