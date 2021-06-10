import {Router} from 'express';
import * as problemController from '../controllers/problem.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', problemController.getProblems);

router.get('/pages/:page', problemController.getProblemsPaginated);

router.get('/:problemId', problemController.getProblemById);

router.post('/',[authJwt.verifyToken], problemController.createProblem);

router.put('/:problemId', [authJwt.verifyToken], problemController.updateProblemById);

router.delete('/:problemId', [authJwt.verifyToken], problemController.deleteProblemById);

export default router;
