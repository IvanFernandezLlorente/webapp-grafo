import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {authJwt, verifySignUp}  from '../middlewares';

const router = Router();

router.get('/',userController.getUsers);

router.get('/:userId',userController.getUserById);

router.post('/signup',[verifySignUp.checkDuplicateNameOrEmail,verifySignUp.checkRolesExisted], userController.signUp);

router.post('/signin', userController.signIn);

router.put('/:userId',[authJwt.verifyToken],userController.updateUserById)

router.delete('/:userId', [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById)

export default router;
