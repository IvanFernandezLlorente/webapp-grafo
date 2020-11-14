import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {authJwt, verifySignUp}  from '../middlewares';

const router = Router();

router.get('/',userController.getUsers);

router.get('/:userId',userController.getUserById);

router.post('/signup',[authJwt.verifyToken, authJwt.isAdmin,verifySignUp.checkDuplicateNameOrEmail,verifySignUp.checkRolesExisted], userController.signUp);

router.post('/signin', userController.signIn);

router.put('/:userId', [authJwt.verifyToken,verifySignUp.checkDuplicateNameOrEmail], userController.updateUserById);

router.delete('/:userId', [authJwt.verifyToken], userController.deleteUserById);

export default router;
