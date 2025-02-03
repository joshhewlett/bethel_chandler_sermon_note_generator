// routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

export default router;