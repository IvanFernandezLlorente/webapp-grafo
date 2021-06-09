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

router.post('/images/:userId',[authJwt.verifyToken], userController.imageProfile);


router.get('/oauth/google/connect/:userId/:token', function (req, res, next) {
    passport.authenticate('connectGoogle', { scope: ['profile', 'email'], state: (JSON.stringify({ userId: req.params.userId, token: req.params.token })) }, { session: false })(req, res, next)
});

router.get('/oauth/google/callback/connect', passport.authenticate('connectGoogle', { session: false }), userController.connectSocial);



router.get('/oauth/github/connect/:userId/:token', function (req, res, next) {
    passport.authenticate('connectGithub', { state: (JSON.stringify({ userId: req.params.userId, token: req.params.token })) }, { session: false })(req, res, next)
});

router.get('/oauth/github/callback/connect', passport.authenticate('connectGithub', { session: false }), userController.connectSocial);



router.get('/oauth/orcid/connect/:userId/:token', function (req, res, next) {
    passport.authenticate('connectORCID', { state: (JSON.stringify({ userId: req.params.userId, token: req.params.token })) }, { session: false })(req, res, next)
});

router.get('/oauth/orcid/callback/connect', passport.authenticate('connectORCID', { session: false }), userController.connectSocial);



router.get('/oauth/google/signin', passport.authenticate('signinGoogle', { scope: ['profile', 'email'] }, { session: false }));

router.get('/oauth/google/callback/signin', passport.authenticate('signinGoogle', { session: false }), userController.signInSocial);



router.get('/oauth/github/signin', passport.authenticate('signinGitHub', { session: false }));

router.get('/oauth/github/callback/signin', passport.authenticate('signinGitHub', { session: false }), userController.signInSocial);



router.get('/oauth/orcid/signin', passport.authenticate('signinORCID', { session: false }));

router.get('/oauth/orcid/callback/signin', passport.authenticate('signinORCID', { session: false }), userController.signInSocial);


router.put('/:userId', [authJwt.verifyToken, verifySignUp.checkDuplicateNameOrEmail], userController.updateUserById);

router.put('/password/:userId', [authJwt.verifyToken], userController.changePassword);

router.delete('/:userId', [authJwt.verifyToken], userController.deleteUserById);

export default router;
