import express from 'express';
import { verifyGstin } from '../controller/gstin/gstinController.js';

const router = express.Router();

router.post('/verify', verifyGstin);

export default router;
