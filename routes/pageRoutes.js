// routes/pageRoutes.js
import express from 'express';
import pageController from '../controllers/pageController.js';
import {
    requireAuth
} from '../middleware/auth.js';

const router = express.Router();

// Home page (requires login)
router.get('/', (_req, res) => res.redirect('/generate-new-notes'));
router.get('/generate-new-notes', requireAuth, pageController.home);

export default router;