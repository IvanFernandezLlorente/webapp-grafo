import userRoutes from './routes/user.routes';
import publicationRoutes from './routes/publication.routes';

export default app => {
    app.use('/api/users', userRoutes);
    app.use('/api/publications', publicationRoutes);
}