import userRoutes from './routes/user.routes';
import publicationRoutes from './routes/publication.routes';
import fileRoutes from './routes/file.routes';
import problemRoutes from './routes/problem.routes';
import applicationRoutes from './routes/application.routes';
import tagRoutes from './routes/tag.routes';
import descriptionRoutes from './routes/description.routes';

export default app => {
    app.use('/api/users', userRoutes);
    app.use('/api/problems', problemRoutes);
    app.use('/api/publications', publicationRoutes);
    app.use('/api/files', fileRoutes);
    app.use('/api/applications', applicationRoutes);
    app.use('/api/tags', tagRoutes);
    app.use('/api/description', descriptionRoutes);
}