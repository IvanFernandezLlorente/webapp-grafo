import {Router} from 'express';
import * as applicationController from '../controllers/application.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', [authJwt.verifyToken, authJwt.isReader], applicationController.getApplications);

router.post('/', applicationController.createApplication);

router.put('/accept/:id', [authJwt.verifyToken, authJwt.isReader], applicationController.acceptApplication);

router.delete('/reject/:id', [authJwt.verifyToken, authJwt.isReader], applicationController.rejectApplication);

export default router;
