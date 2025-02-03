import express from 'express';
import {
    generateNewNotes
} from '../controllers/notesController.js';

const router = express.Router();

router.post('/generate-new-notes', generateNewNotes);

export default router;