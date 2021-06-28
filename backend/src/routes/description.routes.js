import { Router } from 'express';
import * as descriptionController from '../controllers/description.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', descriptionController.getDescription);

router.put('/', [authJwt.verifyToken], descriptionController.updateDescription);

export default router;