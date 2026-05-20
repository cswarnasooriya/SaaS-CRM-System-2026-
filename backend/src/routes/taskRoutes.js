import express from 'express';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .delete(deleteTask);

router.route('/:id/status')
  .patch(updateTaskStatus);

export default router;