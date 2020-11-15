import { Router } from 'express';
import * as imagesController from '../controllers/images.controller';
import multer from '../libs/multer';
import {authJwt}  from '../middlewares';

const router = Router();


router.put('/:userId', [authJwt.verifyToken], multer.single('image'),  imagesController.createImage);

export default router;