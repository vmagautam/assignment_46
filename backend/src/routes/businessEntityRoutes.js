import express from 'express';
import * as businessEntityController from '../controller/businessEntity/businessEntityController.js';

const router = express.Router();

router.get('/', businessEntityController.findAll);
router.get('/:id', businessEntityController.findById);

export default router;
