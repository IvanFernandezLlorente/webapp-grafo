import userRoutes from './routes/user.routes';
import publicationRoutes from './routes/publication.routes';
import imagesRoutes from './routes/images.routes';
import problemRoutes from './routes/problem.routes';

export default app => {
    app.use('/api/users', userRoutes);
    app.use('/api/problems', problemRoutes);
    app.use('/api/publications', publicationRoutes);
    app.use('/api/images', imagesRoutes);
}