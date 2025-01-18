import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getTaskHistoryForUser } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/history/:userId', getTaskHistoryForUser);

export default router;