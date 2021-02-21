import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import { authJwt, verifySignUp } from '../middlewares';
import passport from 'passport';
import passportConfig from '../middlewares/passport';

const router = Router();

router.get('/', userController.getUsers);

router.get('/token',[authJwt.verifyToken], userController.getToken); 

router.get('/:userId', userController.getUserById);

router.post('/signup', [verifySignUp.checkDuplicateNameOrEmail, verifySignUp.checkRolesExisted], userController.signUp);

router.post('/signin', userController.signIn);


router.get('/oauth/google/signup', passport.authenticate('signupGoogle', { scope: ['profile', 'email'] }, { session: false }));

router.get('/oauth/google/callback/signup', passport.authenticate('signupGoogle', { session: false }), userController.signUpSocial);



router.get('/oauth/github/signup', passport.authenticate('signupGithub', { session: false }));

router.get('/oauth/github/callback/signup', passport.authenticate('signupGithub', { session: false }), userController.signUpSocial);



router.get('/oauth/google/signin', passport.authenticate('signinGoogle', { scope: ['profile', 'email'] }, { session: false }));

router.get('/oauth/google/callback/signin', passport.authenticate('signinGoogle', { session: false }), userController.signInSocial);



router.get('/oauth/github/signin', passport.authenticate('signinGitHub', { session: false }));

router.get('/oauth/github/callback/signin', passport.authenticate('signinGitHub', { session: false }), userController.signInSocial);


router.put('/:userId', [authJwt.verifyToken, verifySignUp.checkDuplicateNameOrEmail], userController.updateUserById);

router.delete('/:userId', [authJwt.verifyToken], userController.deleteUserById);

export default router;
