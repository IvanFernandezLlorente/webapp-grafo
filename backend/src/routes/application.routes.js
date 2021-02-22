import {Router} from 'express';
import * as applicationController from '../controllers/application.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', [authJwt.verifyToken, authJwt.isCollaborator], applicationController.getApplications);

router.post('/', applicationController.createApplication);

router.put('/accept/:id', [authJwt.verifyToken, authJwt.isCollaborator], applicationController.acceptApplication);

router.delete('/reject/:id', [authJwt.verifyToken, authJwt.isCollaborator], applicationController.rejectApplication);

export default router;
