import userRoutes from './routes/user.routes';

export default app => {
    app.use('/api/users', userRoutes);
}