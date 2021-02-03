import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import multer from '../libs/multer';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/:fileId', fileController.getFileById);

router.get('/downloads/:fileId', fileController.downloadFile);

router.post('/',[authJwt.verifyToken], multer.single('file'),  fileController.uploadFile);

router.delete('/:fileId',[authJwt.verifyToken], fileController.deleteFile);

export default router;