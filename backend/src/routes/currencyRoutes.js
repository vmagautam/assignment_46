import express from 'express';
import * as currencyController from '../controller/currency/currencyController.js';

const router = express.Router();

router.get('/', currencyController.findAll);
router.get('/:id', currencyController.findById);

export default router;
