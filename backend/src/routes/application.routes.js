import {Router} from 'express';
import * as applicationController from '../controllers/application.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', [authJwt.verifyToken], applicationController.getApplications);

router.get('/:id', applicationController.getApplicationById);

router.post('/', applicationController.createApplication);

router.put('/accept/:id', [authJwt.verifyToken], applicationController.acceptApplication);

router.delete('/reject/:id', [authJwt.verifyToken], applicationController.rejectApplication);

export default router;
