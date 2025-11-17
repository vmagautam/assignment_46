import express from 'express';
import * as statesController from '../controller/states/statesController.js';

const router = express.Router();

router.get('/', statesController.findAll);
router.get('/:id', statesController.findById);

export default router;
