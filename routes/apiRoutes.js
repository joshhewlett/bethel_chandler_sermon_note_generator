// routes/apiRoutes.js
import express from 'express';
import apiController from '../controllers/apiController.js';
import {
    requireAuth
} from '../middleware/auth.js';

const router = express.Router();

// Protect API routes with authentication
router.use(requireAuth);

router.get('/data', apiController.getData);
router.get('/dynamic', apiController.getDynamicContent);

export default router;