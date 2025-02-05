import express from 'express';
import {
    generateNewNotes,
    home
} from '../controllers/notesController.js';
import pageController from '../controllers/pageController.js';
import {
    requireAuth
} from '../middleware/auth.js';

const router = express.Router();

router.get('/generate-new-notes', requireAuth, home);
router.post('/generate-new-notes', generateNewNotes);

export default router;