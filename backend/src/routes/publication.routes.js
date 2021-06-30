import {Router} from 'express';
import * as publicationController from '../controllers/publication.controller';
import {authJwt}  from '../middlewares';

const router = Router();

router.get('/', publicationController.getPublications);

router.get('/pages/:page', publicationController.getPublicationsPaginated);

router.get('/:publicationId', publicationController.getPublicationByPublicationId);

router.get('/id/:id', publicationController.getPublicationById);

router.get('/check/:title/:publicationId', publicationController.checkPublication);

router.post('/',[authJwt.verifyToken],publicationController.createPublication);

router.put('/:publicationId', [authJwt.verifyToken],publicationController.updatePublicationById);

router.delete('/:publicationId', [authJwt.verifyToken],publicationController.deletePublicationById);

export default router;
