import express from 'express';
import {
    generateNewNotes,
    getGenerationIntakeForm,
    printNotes
} from '../controllers/notesController.js';
import {
    requireAuth
} from '../middleware/auth.js';

const router = express.Router();

router.get('/generate-new-notes', requireAuth, getGenerationIntakeForm);
router.post('/generate-new-notes', generateNewNotes);
// router.post('/print-notes', requireAuth, printNotes); TODO: Re-enable
router.post('/print-notes', printNotes);

export default router;