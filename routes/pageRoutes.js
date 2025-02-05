// routes/pageRoutes.js
import express from 'express';
import pageController from '../controllers/pageController.js';

const router = express.Router();

// Redirect root to notes generation
router.get('/', (_req, res) => res.redirect('/generate-new-notes'));

export default router;