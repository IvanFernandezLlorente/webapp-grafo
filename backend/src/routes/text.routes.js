import { Router } from 'express';
import * as textController from '../controllers/text.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/:type', textController.getTextByType);

router.put('/:type', [authJwt.verifyToken], textController.updateTextByType);

export default router;