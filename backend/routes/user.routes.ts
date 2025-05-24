import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

// Routes publiques
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

export default router;
