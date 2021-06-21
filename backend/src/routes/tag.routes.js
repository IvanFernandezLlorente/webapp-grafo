import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', tagController.getTags);

router.post('/',[authJwt.verifyToken], tagController.createTag);

export default router;